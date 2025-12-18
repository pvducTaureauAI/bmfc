"use client";

import { useEffect, useState } from "react";
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

export default function GuestMonthlyFeesPage() {
  const [fees, setFees] = useState<MonthlyFee[]>([]);
  const [loading, setLoading] = useState(true);

  // Get current month and year
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(
    currentDate.getMonth() + 1
  );
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  useEffect(() => {
    fetchFees();
  }, [selectedMonth, selectedYear]);

  const fetchFees = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `/api/monthly-fees?month=${selectedMonth}&year=${selectedYear}`
      );
      if (res.ok) {
        setFees(await res.json());
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  // Generate year options (current year ± 2 years)
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
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Danh sách nộp Quỹ tháng
      </h1>

      {/* Month and Year Picker */}
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex gap-4 items-center">
          <label className="font-semibold text-gray-700">Chọn tháng/năm:</label>
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
              </tr>
            </thead>
            <tbody>
              {fees.map((fee) => (
                <tr key={fee.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800 font-semibold">
                    {fee.member.name}
                  </td>
                  <td className="px-4 py-3 text-gray-800">
                    {fee.month}/{fee.year}
                  </td>
                  <td className="px-4 py-3 text-green-600 font-semibold">
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
                </tr>
              ))}
            </tbody>
          </table>
          {fees.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Không có dữ liệu cho tháng {selectedMonth}/{selectedYear}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
