"use client";

import { useEffect, useState } from "react";
import { handleAuthError } from "@/lib/handleAuthError";
import { formatCurrency } from "@/lib/formatCurrency";

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
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    amount: "50000",
  });

  // Filter state
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchFees();
  }, [selectedMonth, selectedYear]);

  const fetchFees = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/monthly-fees?month=${selectedMonth}&year=${selectedYear}`
      );
      if (res.ok) setFees(await res.json());
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBulkCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !confirm(
        `Tạo quỹ tháng ${formData.month}/${formData.year} cho TẤT CẢ members đang ACTIVE?`
      )
    ) {
      return;
    }

    try {
      const res = await fetch("/api/monthly-fees/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          month: formData.month,
          year: formData.year,
          amount: parseFloat(formData.amount),
        }),
      });
      if (handleAuthError(res)) return;
      const data = await res.json();
      if (res.ok) {
        alert(
          `✅ Thành công!\nĐã tạo: ${data.created} records\nBỏ qua (đã có): ${data.skipped}\nTổng: ${data.total}`
        );
        setShowForm(false);
        setSelectedMonth(formData.month);
        setSelectedYear(formData.year);
        fetchFees();
      } else {
        alert(`Lỗi: ${data.error}`);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  const togglePaid = async (id: number, isPaid: boolean) => {
    try {
      const res = await fetch(`/api/monthly-fees/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isPaid: !isPaid }),
      });
      if (handleAuthError(res)) return;
      if (res.ok) fetchFees();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleDelete = async (id: number, memberName: string) => {
    if (!confirm(`Xóa quỹ tháng của ${memberName}?`)) return;

    try {
      const res = await fetch(`/api/monthly-fees/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        alert("Xóa thành công!");
        fetchFees();
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra!");
    }
  };

  const currentDate = new Date();
  const yearOptions = Array.from(
    { length: 5 },
    (_, i) => currentDate.getFullYear() - 2 + i
  );
  const monthOptions = [
    { value: 1, label: "Tháng 1" },
    { value: 2, label: "Tháng 2" },
    { value: 3, label: "Tháng 3" },
    { value: 4, label: "Tháng 4" },
    { value: 5, label: "Tháng 5" },
    { value: 6, label: "Tháng 6" },
    { value: 7, label: "Tháng 7" },
    { value: 8, label: "Tháng 8" },
    { value: 9, label: "Tháng 9" },
    { value: 10, label: "Tháng 10" },
    { value: 11, label: "Tháng 11" },
    { value: 12, label: "Tháng 12" },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Quỹ tháng</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? "Đóng" : "+ Tạo quỹ tháng mới"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            Tạo quỹ tháng cho TẤT CẢ members
          </h2>
          <p className="text-gray-600 mb-4">
            Sẽ tự động tạo quỹ tháng cho tất cả members đang ACTIVE. Sau đó bạn
            có thể xóa những người không tham gia.
          </p>
          <form onSubmit={handleBulkCreate}>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Tháng *
                </label>
                <select
                  value={formData.month}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      month: parseInt(e.target.value),
                    })
                  }
                  className="w-full px-3 py-2 border rounded text-gray-800"
                  required
                >
                  {monthOptions.map((m) => (
                    <option key={m.value} value={m.value}>
                      {m.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">
                  Năm *
                </label>
                <select
                  value={formData.year}
                  onChange={(e) =>
                    setFormData({ ...formData, year: parseInt(e.target.value) })
                  }
                  className="w-full px-3 py-2 border rounded text-gray-800"
                  required
                >
                  {yearOptions.map((year) => (
                    <option key={year} value={year}>
                      {year}
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
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-semibold"
            >
              🎯 Tạo cho TẤT CẢ members
            </button>
          </form>
        </div>
      )}

      {/* Filter Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4 items-center">
          <label className="font-semibold text-gray-700">Xem quỹ tháng:</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            {monthOptions.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(parseInt(e.target.value))}
            className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-8">Đang tải...</div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-gray-700">Member</th>
                <th className="px-4 py-3 text-left text-gray-700">Tháng/Năm</th>
                <th className="px-4 py-3 text-left text-gray-700">Số tiền</th>
                <th className="px-4 py-3 text-left text-gray-700">
                  Trạng thái
                </th>
                <th className="px-4 py-3 text-left text-gray-700">Ngày nộp</th>
                <th className="px-4 py-3 text-left text-gray-700">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {fees.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-gray-500"
                  >
                    Không có dữ liệu cho tháng {selectedMonth}/{selectedYear}
                  </td>
                </tr>
              ) : (
                fees.map((fee) => (
                  <tr key={fee.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 text-gray-800 font-semibold">
                      {fee.member.name}
                    </td>
                    <td className="px-4 py-3 text-gray-800">
                      {fee.month}/{fee.year}
                    </td>
                    <td className="px-4 py-3 text-gray-800">
                      {formatCurrency(fee.amount)} đ
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
                      <div className="flex gap-2">
                        <button
                          onClick={() => togglePaid(fee.id, fee.isPaid)}
                          className="text-blue-600 hover:underline text-sm"
                        >
                          {fee.isPaid ? "Hủy nộp" : "✓ Đã nộp"}
                        </button>
                        <button
                          onClick={() => handleDelete(fee.id, fee.member.name)}
                          className="text-red-600 hover:underline text-sm"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
