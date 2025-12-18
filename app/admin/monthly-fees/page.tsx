"use client";

import { useEffect, useState } from "react";

interface Member {
  id: number;
  name: string;
}

interface MonthlyFee {
  id: number;
  memberId: number;
  month: number;
  year: number;
  amount: number;
  isPaid: boolean;
  paidDate: string | null;
  member: Member;
}

export default function AdminMonthlyFeesPage() {
  const [fees, setFees] = useState<MonthlyFee[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    memberId: "",
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    amount: "50000",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [feesRes, membersRes] = await Promise.all([
        fetch("/api/monthly-fees"),
        fetch("/api/members"),
      ]);
      if (feesRes.ok) setFees(await feesRes.json());
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
      const res = await fetch("/api/monthly-fees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          memberId: parseInt(formData.memberId),
          amount: parseFloat(formData.amount),
        }),
      });
      if (res.ok) {
        alert("Thêm thành công!");
        setShowForm(false);
        fetchData();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const togglePaid = async (id: number, isPaid: boolean) => {
    try {
      const res = await fetch(`/api/monthly-fees/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPaid: !isPaid }),
      });
      if (res.ok) fetchData();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Quỹ tháng</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? "Đóng" : "+ Thêm quỹ"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Thêm quỹ tháng
          </h2>
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
                  Tháng *
                </label>
                <input
                  type="number"
                  min="1"
                  max="12"
                  value={formData.month}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      month: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border rounded text-gray-800"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Năm *
                </label>
                <input
                  type="number"
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 border rounded text-gray-800"
                  required
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
              <th className="px-4 py-3 text-left text-gray-700">Tháng/Năm</th>
              <th className="px-4 py-3 text-left text-gray-700">Số tiền</th>
              <th className="px-4 py-3 text-left text-gray-700">Trạng thái</th>
              <th className="px-4 py-3 text-left text-gray-700">Ngày nộp</th>
              <th className="px-4 py-3 text-left text-gray-700">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {fees.map((fee) => (
              <tr key={fee.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-800">{fee.member.name}</td>
                <td className="px-4 py-3 text-gray-800">
                  {fee.month}/{fee.year}
                </td>
                <td className="px-4 py-3 text-gray-800">
                  {fee.amount.toLocaleString("vi-VN")} đ
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      fee.isPaid
                        ? "bg-green-200 text-green-800"
                        : "bg-yellow-200 text-yellow-800"
                    }`}
                  >
                    {fee.isPaid ? "Đã nộp" : "Chưa nộp"}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-800">
                  {fee.paidDate
                    ? new Date(fee.paidDate).toLocaleDateString("vi-VN")
                    : "-"}
                </td>
                <td className="px-4 py-3">
                  <button
                    onClick={() => togglePaid(fee.id, fee.isPaid)}
                    className="text-blue-600 hover:underline"
                  >
                    {fee.isPaid ? "Hủy nộp" : "Đánh dấu đã nộp"}
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
