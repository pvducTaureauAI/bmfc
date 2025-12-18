"use client";

import { useState } from "react";
import { formatCurrency } from "@/lib/formatCurrency";

interface Member {
  id: number;
  name: string;
}

interface StatisticsSummary {
  totalIncome: number;
  monthlyFeesIncome: number;
  penaltiesIncome: number;
  totalExpense: number;
  balance: number;
}

interface StatisticsDetails {
  monthlyFees: Array<{
    id: number;
    amount: number;
    month: number;
    year: number;
    paidDate: string;
    member: Member;
  }>;
  penalties: Array<{
    id: number;
    amount: number;
    reason: string | null;
    paidDate: string;
    member: Member;
  }>;
  expenses: Array<{
    id: number;
    amount: number;
    reason: string;
    date: string;
  }>;
}

interface StatisticsData {
  summary: StatisticsSummary;
  details: StatisticsDetails;
}

export default function GuestStatisticsPage() {
  const [data, setData] = useState<StatisticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fromDate || !toDate) {
      alert("Vui lòng chọn khoảng thời gian");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`/api/statistics?from=${fromDate}&to=${toDate}`);
      if (res.ok) {
        const result = await res.json();
        setData(result);
      } else {
        alert("Có lỗi xảy ra");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Thống kê Thu Chi
      </h1>

      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800">
          Chọn khoảng thời gian
        </h2>
        <form onSubmit={handleSubmit} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-2">
              Từ ngày
            </label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-3 py-2 border rounded text-gray-800"
              required
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 font-semibold mb-2">
              Đến ngày
            </label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full px-3 py-2 border rounded text-gray-800"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "Đang tải..." : "Xem thống kê"}
          </button>
        </form>
      </div>

      {data && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-500 text-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-1">Tổng Thu</h3>
              <p className="text-2xl font-bold">
                {formatCurrency(data.summary.totalIncome)} đ
              </p>
            </div>
            <div className="bg-blue-500 text-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-1">Quỹ tháng</h3>
              <p className="text-2xl font-bold">
                {formatCurrency(data.summary.monthlyFeesIncome)} đ
              </p>
            </div>
            <div className="bg-orange-500 text-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-1">Phạt</h3>
              <p className="text-2xl font-bold">
                {formatCurrency(data.summary.penaltiesIncome)} đ
              </p>
            </div>
            <div className="bg-red-500 text-white p-4 rounded-lg shadow">
              <h3 className="font-semibold mb-1">Tổng Chi</h3>
              <p className="text-2xl font-bold">
                {formatCurrency(data.summary.totalExpense)} đ
              </p>
            </div>
          </div>

          <div className="bg-linear-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg mb-6">
            <h3 className="text-xl font-semibold mb-2">Chênh lệch</h3>
            <p className="text-4xl font-bold">
              {data.summary.balance >= 0 ? "+" : ""}
              {formatCurrency(data.summary.balance)} đ
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-4 text-gray-800">
                📊 Quỹ tháng ({data.details.monthlyFees.length})
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {data.details.monthlyFees.map((fee) => (
                  <div
                    key={fee.id}
                    className="border-b pb-2 text-sm text-gray-700"
                  >
                    <div className="font-semibold">{fee.member.name}</div>
                    <div className="text-green-600 font-semibold">
                      +{formatCurrency(fee.amount)} đ
                    </div>
                    <div className="text-gray-500 text-xs">
                      {new Date(fee.paidDate).toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-4 text-gray-800">
                ⚠️ Phạt ({data.details.penalties.length})
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {data.details.penalties.map((penalty) => (
                  <div
                    key={penalty.id}
                    className="border-b pb-2 text-sm text-gray-700"
                  >
                    <div className="font-semibold">{penalty.member.name}</div>
                    <div className="text-green-600 font-semibold">
                      +{formatCurrency(penalty.amount)} đ
                    </div>
                    <div className="text-gray-600 text-xs">
                      {penalty.reason || "Không ghi chú"}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {new Date(penalty.paidDate).toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-bold mb-4 text-gray-800">
                💸 Chi tiêu ({data.details.expenses.length})
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {data.details.expenses.map((expense) => (
                  <div
                    key={expense.id}
                    className="border-b pb-2 text-sm text-gray-700"
                  >
                    <div className="text-red-600 font-semibold">
                      -{formatCurrency(expense.amount)} đ
                    </div>
                    <div className="text-gray-600 text-xs">
                      {expense.reason}
                    </div>
                    <div className="text-gray-500 text-xs">
                      {new Date(expense.date).toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
