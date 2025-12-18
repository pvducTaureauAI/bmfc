"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface FundSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export default function GuestDashboard() {
  const [fund, setFund] = useState<FundSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFund();
  }, []);

  const fetchFund = async () => {
    try {
      const res = await fetch("/api/fund");
      if (res.ok) {
        const data = await res.json();
        setFund(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="text-center py-8">Đang tải...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Guest Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-500 text-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Tổng Thu</h3>
          <p className="text-3xl font-bold">
            {fund?.totalIncome.toLocaleString("vi-VN")} đ
          </p>
        </div>
        <div className="bg-red-500 text-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Tổng Chi</h3>
          <p className="text-3xl font-bold">
            {fund?.totalExpense.toLocaleString("vi-VN")} đ
          </p>
        </div>
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Quỹ hiện tại</h3>
          <p className="text-3xl font-bold">
            {fund?.balance.toLocaleString("vi-VN")} đ
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          href="/guest/members"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            👥 Danh sách Members
          </h3>
          <p className="text-gray-600">Xem tất cả thành viên</p>
        </Link>

        <Link
          href="/guest/penalties"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            ⚠️ Phạt hôm nay
          </h3>
          <p className="text-gray-600">Xem danh sách phạt</p>
        </Link>

        <Link
          href="/guest/monthly-fees"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            💰 Quỹ tháng
          </h3>
          <p className="text-gray-600">Xem danh sách nộp quỹ</p>
        </Link>

        <Link
          href="/guest/fund"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            💵 Tổng quỹ
          </h3>
          <p className="text-gray-600">Xem chi tiết quỹ</p>
        </Link>

        <Link
          href="/guest/statistics"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            📊 Thống kê
          </h3>
          <p className="text-gray-600">Xem thống kê thu chi</p>
        </Link>
      </div>
    </div>
  );
}
