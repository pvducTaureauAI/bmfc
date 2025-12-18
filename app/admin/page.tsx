"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/formatCurrency";
import Link from "next/link";

interface FundSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export default function AdminDashboard() {
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
      console.error("Error fetching fund:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-green-500 text-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Tổng Thu</h3>
          <p className="text-3xl font-bold">
            {formatCurrency(fund?.totalIncome || 0)} đ
          </p>
        </div>
        <div className="bg-red-500 text-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Tổng Chi</h3>
          <p className="text-3xl font-bold">
            {formatCurrency(fund?.totalExpense || 0)} đ
          </p>
        </div>
        <div className="bg-blue-500 text-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Quỹ hiện tại</h3>
          <p className="text-3xl font-bold">
            {formatCurrency(fund?.balance || 0)} đ
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/admin/members"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            👥 Quản lý Members
          </h3>
          <p className="text-gray-600">Thêm, sửa, xóa thành viên</p>
        </Link>

        <Link
          href="/admin/monthly-fees"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            💰 Quỹ tháng
          </h3>
          <p className="text-gray-600">Quản lý nộp quỹ hàng tháng</p>
        </Link>

        <Link
          href="/admin/penalties"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <h3 className="text-xl font-semibold mb-2 text-gray-800">⚠️ Phạt</h3>
          <p className="text-gray-600">Quản lý danh sách phạt</p>
        </Link>

        <Link
          href="/admin/expenses"
          className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
        >
          <h3 className="text-xl font-semibold mb-2 text-gray-800">
            💸 Chi tiêu
          </h3>
          <p className="text-gray-600">Quản lý các khoản chi</p>
        </Link>
      </div>
    </div>
  );
}
