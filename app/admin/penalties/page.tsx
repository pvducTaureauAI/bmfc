"use client";

import { useEffect, useState } from "react";
import { handleAuthError } from "@/lib/handleAuthError";
import { formatCurrency } from "@/lib/formatCurrency";

interface Member {
  id: number;
  name: string;
}

interface Penalty {
  id: number;
  memberId: number;
  date: string;
  amount: number;
  reason: string | null;
  isPaid: boolean;
  paidDate: string | null;
  member: Member;
}

export default function AdminPenaltiesPage() {
  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedMembers, setSelectedMembers] = useState<number[]>([]);
  const [formData, setFormData] = useState({
    amount: "20000",
    reason: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [penaltiesRes, membersRes] = await Promise.all([
        fetch("/api/penalties"),
        fetch("/api/members"),
      ]);
      if (penaltiesRes.ok) setPenalties(await penaltiesRes.json());
      if (membersRes.ok) setMembers(await membersRes.json());
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleMemberSelection = (memberId: number) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const selectAllMembers = () => {
    setSelectedMembers(members.map((m) => m.id));
  };

  const clearSelection = () => {
    setSelectedMembers([]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedMembers.length === 0) {
      alert("Vui lòng chọn ít nhất 1 member!");
      return;
    }

    if (!confirm(`Tạo phạt cho ${selectedMembers.length} member(s)?`)) {
      return;
    }

    try {
      let successCount = 0;
      let failCount = 0;

      // Create penalty for each selected member
      for (const memberId of selectedMembers) {
        const res = await fetch("/api/penalties", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            ...formData,
            memberId: memberId,
            amount: parseFloat(formData.amount),
          }),
        });
        if (handleAuthError(res)) return;
        if (res.ok) {
          successCount++;
        } else {
          failCount++;
        }
      }

      alert(
        `✅ Thành công: ${successCount} phạt\n${
          failCount > 0 ? `❌ Thất bại: ${failCount}` : ""
        }`
      );
      setShowForm(false);
      setSelectedMembers([]);
      fetchData();
    } catch (error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  const togglePaid = async (id: number, isPaid: boolean) => {
    try {
      const res = await fetch(`/api/penalties/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPaid: !isPaid }),
      });
      if (handleAuthError(res)) return;
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa?")) return;
    try {
      const res = await fetch(`/api/penalties/${id}`, { method: "DELETE" });
      if (handleAuthError(res)) return;
      if (res.ok) {
        alert("Xóa thành công!");
        fetchData();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) return <div className="text-center py-4">Đang tải...</div>;

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 md:mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Quản lý Phạt
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm md:text-base w-full sm:w-auto"
        >
          {showForm ? "Đóng" : "+ Thêm phạt"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-4 md:p-6 rounded-lg shadow mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-bold mb-4 text-gray-800">
            Thêm phạt
          </h2>
          <form onSubmit={handleSubmit}>
            {/* Member Selection */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <label className="block text-gray-700 font-semibold">
                  Chọn Members * ({selectedMembers.length} đã chọn)
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={selectAllMembers}
                    className="text-sm text-blue-600 hover:underline"
                  >
                    Chọn tất cả
                  </button>
                  <button
                    type="button"
                    onClick={clearSelection}
                    className="text-sm text-red-600 hover:underline"
                  >
                    Bỏ chọn
                  </button>
                </div>
              </div>
              <div className="border rounded p-2 md:p-3 max-h-60 overflow-y-auto bg-gray-50">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {members.map((member) => (
                    <label
                      key={member.id}
                      className={`flex items-center gap-2 p-2 rounded cursor-pointer transition ${
                        selectedMembers.includes(member.id)
                          ? "bg-blue-100 border-blue-500 border"
                          : "bg-white border border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedMembers.includes(member.id)}
                        onChange={() => toggleMemberSelection(member.id)}
                        className="w-4 h-4"
                      />
                      <span className="text-sm text-gray-800">
                        {member.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                  Số tiền *
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded text-gray-800 text-sm md:text-base"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                  Ngày
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded text-gray-800 text-sm md:text-base"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm md:text-base">
                  Lý do
                </label>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded text-gray-800 text-sm md:text-base"
                  placeholder="Thua trận..."
                />
              </div>
            </div>
            <button
              type="submit"
              className="w-full md:w-auto bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-semibold text-sm md:text-base"
            >
              ✓ Tạo phạt cho {selectedMembers.length} member(s)
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm" style={{ minWidth: "640px" }}>
          <thead className="bg-gray-200">
            <tr>
              <th className="px-2 md:px-4 py-3 text-left text-gray-700">
                Member
              </th>
              <th className="px-2 md:px-4 py-3 text-left text-gray-700">
                Ngày
              </th>
              <th className="px-2 md:px-4 py-3 text-left text-gray-700">
                Số tiền
              </th>
              <th className="px-2 md:px-4 py-3 text-left text-gray-700">
                Lý do
              </th>
              <th className="px-2 md:px-4 py-3 text-left text-gray-700">
                Trạng thái
              </th>
              <th className="px-2 md:px-4 py-3 text-left text-gray-700">
                Thao tác
              </th>
            </tr>
          </thead>
          <tbody>
            {penalties.map((penalty) => (
              <tr key={penalty.id} className="border-b hover:bg-gray-50">
                <td className="px-2 md:px-4 py-3 text-gray-800">
                  {penalty.member.name}
                </td>
                <td className="px-2 md:px-4 py-3 text-gray-800">
                  {new Date(penalty.date).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-2 md:px-4 py-3 text-gray-800">
                  {formatCurrency(penalty.amount)} đ
                </td>
                <td className="px-2 md:px-4 py-3 text-gray-800">
                  {penalty.reason || "-"}
                </td>
                <td className="px-2 md:px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      penalty.isPaid
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {penalty.isPaid ? "Đã nộp" : "Chưa nộp"}
                  </span>
                </td>
                <td className="px-2 md:px-4 py-3">
                  <button
                    onClick={() => togglePaid(penalty.id, penalty.isPaid)}
                    className="text-blue-600 hover:underline mr-2 text-xs md:text-sm"
                  >
                    {penalty.isPaid ? "Hủy" : "Đánh dấu"}
                  </button>
                  <button
                    onClick={() => handleDelete(penalty.id)}
                    className="text-red-600 hover:underline text-xs md:text-sm"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
