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

export default function GuestPenaltiesPage() {
  const [penalties, setPenalties] = useState<Penalty[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPenalties();
  }, []);

  const fetchPenalties = async () => {
    try {
      const res = await fetch("/api/penalties?today=true");
      if (res.ok) {
        setPenalties(await res.json());
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
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Phạt hôm nay</h1>

      {penalties.length === 0 ? (
        <div className="bg-white p-8 rounded-lg shadow text-center">
          <p className="text-gray-600 text-lg">Không có phạt hôm nay 🎉</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-200">
              <tr>
                <th className="px-4 py-3 text-left text-gray-700">Member</th>
                <th className="px-4 py-3 text-left text-gray-700">Số tiền</th>
                <th className="px-4 py-3 text-left text-gray-700">Lý do</th>
                <th className="px-4 py-3 text-left text-gray-700">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody>
              {penalties.map((penalty) => (
                <tr key={penalty.id} className="border-b hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-800 font-semibold">
                    {penalty.member.name}
                  </td>
                  <td className="px-4 py-3 text-red-600 font-semibold">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
