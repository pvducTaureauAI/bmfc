"use client";

import { useEffect, useState } from "react";

interface FundSummary {
  totalIncome: number;
  monthlyFeesIncome: number;
  penaltiesIncome: number;
  totalExpense: number;
  balance: number;
}

export default function GuestFundPage() {
  const [fund, setFund] = useState<FundSummary | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFund();
  }, []);

  const fetchFund = async () => {
    try {
      const res = await fetch("/api/fund");
      if (res.ok) {
        setFund(await res.json());
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Tổng quỹ</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Thu nhập</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Quỹ tháng:</span>
              <span className="text-green-600 font-semibold">
                +{fund?.monthlyFeesIncome.toLocaleString("vi-VN")} đ
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Phạt:</span>
              <span className="text-green-600 font-semibold">
                +{fund?.penaltiesIncome.toLocaleString("vi-VN")} đ
              </span>
            </div>
            <div className="border-t pt-3">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-800">Tổng thu:</span>
                <span className="text-green-600 font-bold text-lg">
                  {fund?.totalIncome.toLocaleString("vi-VN")} đ
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">Chi tiêu</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Tổng chi:</span>
              <span className="text-red-600 font-semibold">
                -{fund?.totalExpense.toLocaleString("vi-VN")} đ
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-linear-to-r from-blue-500 to-blue-600 text-white p-8 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4">💰 Quỹ hiện tại</h2>
        <p className="text-5xl font-bold">
          {fund?.balance.toLocaleString("vi-VN")} đ
        </p>
        <p className="mt-4 text-blue-100">
          = Thu ({fund?.totalIncome.toLocaleString("vi-VN")} đ) - Chi (
          {fund?.totalExpense.toLocaleString("vi-VN")} đ)
        </p>
      </div>
    </div>
  );
}
