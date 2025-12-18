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

export default function GuestMonthlyFeesPage() {
  const [fees, setFees] = useState<MonthlyFee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFees();
  }, []);

  const fetchFees = async () => {
    try {
      const res = await fetch("/api/monthly-fees");
      if (res.ok) {
        setFees(await res.json());
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
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Danh sách nộp Quỹ tháng
      </h1>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-gray-700">Member</th>
              <th className="px-4 py-3 text-left text-gray-700">Tháng/Năm</th>
              <th className="px-4 py-3 text-left text-gray-700">Số tiền</th>
              <th className="px-4 py-3 text-left text-gray-700">Trạng thái</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
