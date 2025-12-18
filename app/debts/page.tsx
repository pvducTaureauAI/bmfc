"use client";

import { useEffect, useState } from "react";
import { formatCurrency } from "@/lib/formatCurrency";

interface DebtDetail {
  memberId: number;
  memberName: string;
  monthlyFeesDebt: number;
  penaltiesDebt: number;
  totalDebt: number;
  unpaidMonthlyFees: Array<{
    id: number;
    month: number;
    year: number;
    amount: number;
  }>;
  unpaidPenalties: Array<{
    id: number;
    date: string;
    amount: number;
    reason: string;
  }>;
}

interface DebtSummary {
  totalMonthlyFeesDebt: number;
  totalPenaltiesDebt: number;
  totalDebt: number;
  totalMembers: number;
}

interface DebtsResponse {
  summary: DebtSummary;
  debts: DebtDetail[];
}

export default function DebtsPage() {
  const [data, setData] = useState<DebtsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedMember, setExpandedMember] = useState<number | null>(null);

  useEffect(() => {
    fetchDebts();
  }, []);

  const fetchDebts = async () => {
    try {
      const res = await fetch("/api/debts");
      if (res.ok) {
        const debtsData = await res.json();
        setData(debtsData);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (memberId: number) => {
    setExpandedMember(expandedMember === memberId ? null : memberId);
  };

  if (loading) return <div className="text-center py-8">Đang tải...</div>;

  if (!data) return <div className="text-center py-8">Không có dữ liệu</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Danh sách Nợ</h1>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-orange-500 text-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-1">Số người nợ</h3>
          <p className="text-2xl font-bold">{data.summary.totalMembers}</p>
        </div>
        <div className="bg-yellow-500 text-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-1">Nợ Quỹ tháng</h3>
          <p className="text-2xl font-bold">
            {formatCurrency(data.summary.totalMonthlyFeesDebt)} đ
          </p>
        </div>
        <div className="bg-red-500 text-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-1">Nợ Phạt</h3>
          <p className="text-2xl font-bold">
            {formatCurrency(data.summary.totalPenaltiesDebt)} đ
          </p>
        </div>
        <div className="bg-purple-600 text-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-semibold mb-1">Tổng Nợ</h3>
          <p className="text-2xl font-bold">
            {formatCurrency(data.summary.totalDebt)} đ
          </p>
        </div>
      </div>

      {/* Debts List */}
      <div className="bg-white rounded-lg shadow">
        {data.debts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            🎉 Không có ai đang nợ!
          </div>
        ) : (
          <div className="divide-y">
            {data.debts.map((debt) => (
              <div key={debt.memberId} className="p-4">
                <div
                  className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                  onClick={() => toggleExpand(debt.memberId)}
                >
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-800">
                      {debt.memberName}
                    </h3>
                    <div className="flex gap-4 mt-1 text-sm">
                      {debt.monthlyFeesDebt > 0 && (
                        <span className="text-yellow-600">
                          Quỹ: {formatCurrency(debt.monthlyFeesDebt)} đ
                        </span>
                      )}
                      {debt.penaltiesDebt > 0 && (
                        <span className="text-red-600">
                          Phạt: {formatCurrency(debt.penaltiesDebt)} đ
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">
                      {formatCurrency(debt.totalDebt)} đ
                    </div>
                    <button className="text-blue-600 text-sm mt-1">
                      {expandedMember === debt.memberId
                        ? "▲ Thu gọn"
                        : "▼ Chi tiết"}
                    </button>
                  </div>
                </div>

                {/* Expanded Details */}
                {expandedMember === debt.memberId && (
                  <div className="mt-4 pl-4 border-l-4 border-blue-500">
                    {/* Monthly Fees */}
                    {debt.unpaidMonthlyFees.length > 0 && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-gray-700 mb-2">
                          💰 Nợ Quỹ tháng ({debt.unpaidMonthlyFees.length})
                        </h4>
                        <div className="space-y-2">
                          {debt.unpaidMonthlyFees.map((fee) => (
                            <div
                              key={fee.id}
                              className="flex justify-between bg-yellow-50 p-2 rounded"
                            >
                              <span className="text-gray-700">
                                Tháng {fee.month}/{fee.year}
                              </span>
                              <span className="font-semibold text-yellow-700">
                                {formatCurrency(fee.amount)} đ
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Penalties */}
                    {debt.unpaidPenalties.length > 0 && (
                      <div>
                        <h4 className="font-semibold text-gray-700 mb-2">
                          ⚠️ Nợ Phạt ({debt.unpaidPenalties.length})
                        </h4>
                        <div className="space-y-2">
                          {debt.unpaidPenalties.map((penalty) => (
                            <div
                              key={penalty.id}
                              className="flex justify-between bg-red-50 p-2 rounded"
                            >
                              <div>
                                <div className="text-gray-700">
                                  {new Date(penalty.date).toLocaleDateString(
                                    "vi-VN"
                                  )}
                                </div>
                                <div className="text-sm text-gray-600">
                                  {penalty.reason}
                                </div>
                              </div>
                              <span className="font-semibold text-red-700">
                                {formatCurrency(penalty.amount)} đ
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
