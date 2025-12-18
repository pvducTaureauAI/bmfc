"use client";

import { useEffect, useState } from "react";
import { handleAuthError } from "@/lib/handleAuthError";
import { formatCurrency } from "@/lib/formatCurrency";

interface Expense {
  id: number;
  amount: number;
  reason: string;
  date: string;
}

export default function AdminExpensesPage() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    reason: "",
    date: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await fetch("/api/expenses");
      if (res.ok) {
        const data = await res.json();
        setExpenses(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/expenses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      });
      if (handleAuthError(res)) return;
      if (res.ok) {
        alert("Thêm chi tiêu thành công!");
        setFormData({
          amount: "",
          reason: "",
          date: new Date().toISOString().split("T")[0],
        });
        setShowForm(false);
        fetchExpenses();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Chi tiêu</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? "Đóng" : "+ Thêm chi tiêu"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Thêm chi tiêu
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
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
                placeholder="100000"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Lý do *
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) =>
                  setFormData({ ...formData, reason: e.target.value })
                }
                className="w-full px-3 py-2 border rounded text-gray-800"
                rows={3}
                placeholder="Mua bóng, nước uống..."
                required
              />
            </div>
            <div className="mb-4">
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
              <th className="px-4 py-3 text-left text-gray-700">ID</th>
              <th className="px-4 py-3 text-left text-gray-700">Ngày</th>
              <th className="px-4 py-3 text-left text-gray-700">Số tiền</th>
              <th className="px-4 py-3 text-left text-gray-700">Lý do</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => (
              <tr key={expense.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-800">{expense.id}</td>
                <td className="px-4 py-3 text-gray-800">
                  {new Date(expense.date).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-4 py-3 text-red-600 font-semibold">
                  -{formatCurrency(expense.amount)} đ
                </td>
                <td className="px-4 py-3 text-gray-800">{expense.reason}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
