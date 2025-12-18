"use client";

import { useEffect, useState } from "react";

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
  const [formData, setFormData] = useState({
    memberId: "",
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/penalties", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          memberId: parseInt(formData.memberId),
          amount: parseFloat(formData.amount),
        }),
      });
      if (res.ok) {
        alert("Thêm phạt thành công!");
        setShowForm(false);
        fetchData();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const togglePaid = async (id: number, isPaid: boolean) => {
    try {
      const res = await fetch(`/api/penalties/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPaid: !isPaid }),
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa?")) return;
    try {
      const res = await fetch(`/api/penalties/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Xóa thành công!");
        fetchData();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Phạt</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? "Đóng" : "+ Thêm phạt"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Thêm phạt</h2>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Member *
                </label>
                <select
                  value={formData.memberId}
                  onChange={(e) =>
                    setFormData({ ...formData, memberId: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded text-gray-800"
                  required
                >
                  <option value="">-- Chọn member --</option>
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Số tiền *
                </label>
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) =>
                    setFormData({ ...formData, amount: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded text-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Ngày
                </label>
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded text-gray-800"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Lý do
                </label>
                <input
                  type="text"
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded text-gray-800"
                  placeholder="Thua trận..."
                />
              </div>
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              Thêm
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-gray-700">Member</th>
              <th className="px-4 py-3 text-left text-gray-700">Ngày</th>
              <th className="px-4 py-3 text-left text-gray-700">Số tiền</th>
              <th className="px-4 py-3 text-left text-gray-700">Lý do</th>
              <th className="px-4 py-3 text-left text-gray-700">Trạng thái</th>
              <th className="px-4 py-3 text-left text-gray-700">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {penalties.map((penalty) => (
              <tr key={penalty.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-800">
                  {penalty.member.name}
                </td>
                <td className="px-4 py-3 text-gray-800">
                  {new Date(penalty.date).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-4 py-3 text-gray-800">
                  {penalty.amount.toLocaleString("vi-VN")} đ
                </td>
                <td className="px-4 py-3 text-gray-800">
                  {penalty.reason || "-"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      penalty.isPaid
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {penalty.isPaid ? "Đã nộp" : "Chưa nộp"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => togglePaid(penalty.id, penalty.isPaid)}
                    className="text-blue-600 hover:underline mr-3"
                  >
                    {penalty.isPaid ? "Hủy" : "Đánh dấu"}
                  </button>
                  <button
                    onClick={() => handleDelete(penalty.id)}
                    className="text-red-600 hover:underline"
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
