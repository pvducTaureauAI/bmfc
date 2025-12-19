"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { formatCurrency } from "@/lib/formatCurrency";

interface FundSummary {
  totalIncome: number;
  totalExpense: number;
  balance: number;
}

export default function Home() {
  const [fund, setFund] = useState<FundSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
    <div className="min-h-screen">
      <nav className="glass sticky top-0 z-50 shadow-xl border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link
              href="/"
              className="flex items-center gap-2 text-xl md:text-2xl font-bold hover:scale-105 transition-transform"
            >
              <span className="text-3xl">⚽</span>
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Bình Minh FC
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex gap-2 xl:gap-4 items-center">
              <Link
                href="/members"
                className="text-gray-700 hover:text-blue-600 transition-all font-medium text-sm xl:text-base px-3 py-2 rounded-lg hover:bg-white/50"
              >
                Members
              </Link>
              <Link
                href="/penalties"
                className="text-gray-700 hover:text-orange-600 transition-all font-medium text-sm xl:text-base px-3 py-2 rounded-lg hover:bg-white/50"
              >
                Phạt
              </Link>
              <Link
                href="/monthly-fees"
                className="text-gray-700 hover:text-green-600 transition-all font-medium text-sm xl:text-base px-3 py-2 rounded-lg hover:bg-white/50"
              >
                Quỹ tháng
              </Link>
              <Link
                href="/fund"
                className="text-gray-700 hover:text-purple-600 transition-all font-medium text-sm xl:text-base px-3 py-2 rounded-lg hover:bg-white/50"
              >
                Tổng quỹ
              </Link>
              <Link
                href="/debts"
                className="text-gray-700 hover:text-red-600 transition-all font-medium text-sm xl:text-base px-3 py-2 rounded-lg hover:bg-white/50"
              >
                Nợ
              </Link>
              <Link
                href="/statistics"
                className="text-gray-700 hover:text-indigo-600 transition-all font-medium text-sm xl:text-base px-3 py-2 rounded-lg hover:bg-white/50"
              >
                Thống kê
              </Link>
              <Link
                href="/login"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 xl:px-6 py-2 rounded-xl hover:shadow-lg hover:scale-105 transition-all font-semibold text-sm xl:text-base"
              >
                🔑 Đăng nhập
              </Link>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden text-gray-700 hover:text-blue-600 p-2"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 space-y-2">
              <Link
                href="/members"
                className="block text-gray-700 hover:text-blue-600 hover:bg-gray-100 px-3 py-2 rounded transition font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Members
              </Link>
              <Link
                href="/penalties"
                className="block text-gray-700 hover:text-blue-600 hover:bg-gray-100 px-3 py-2 rounded transition font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Phạt
              </Link>
              <Link
                href="/monthly-fees"
                className="block text-gray-700 hover:text-blue-600 hover:bg-gray-100 px-3 py-2 rounded transition font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Quỹ tháng
              </Link>
              <Link
                href="/fund"
                className="block text-gray-700 hover:text-blue-600 hover:bg-gray-100 px-3 py-2 rounded transition font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Tổng quỹ
              </Link>
              <Link
                href="/debts"
                className="block text-gray-700 hover:text-blue-600 hover:bg-gray-100 px-3 py-2 rounded transition font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Nợ
              </Link>
              <Link
                href="/statistics"
                className="block text-gray-700 hover:text-blue-600 hover:bg-gray-100 px-3 py-2 rounded transition font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Thống kê
              </Link>
              <Link
                href="/login"
                className="block bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-center"
                onClick={() => setIsMenuOpen(false)}
              >
                🔑 Đăng nhập
              </Link>
            </div>
          )}
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-4 md:p-8">
        <div className="text-center mb-8 md:mb-12 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-2 text-white">
            ⚡ Tổng quan Quỹ
          </h2>
          <p className="text-white/80 text-sm md:text-base">
            Quản lý tài chính câu lạc bộ một cách chuyên nghiệp
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
          <div className="group relative bg-gradient-to-br from-emerald-400 via-green-500 to-teal-600 text-white p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in">
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="text-3xl mb-3">💰</div>
              <h3 className="text-base md:text-lg font-semibold mb-3 opacity-90">
                Tổng Thu
              </h3>
              <p className="text-3xl md:text-4xl font-bold mb-2">
                {formatCurrency(fund?.totalIncome || 0)}
              </p>
              <p className="text-sm opacity-75">đồng</p>
            </div>
          </div>
          <div
            className="group relative bg-gradient-to-br from-rose-400 via-red-500 to-pink-600 text-white p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="text-3xl mb-3">💸</div>
              <h3 className="text-base md:text-lg font-semibold mb-3 opacity-90">
                Tổng Chi
              </h3>
              <p className="text-3xl md:text-4xl font-bold mb-2">
                {formatCurrency(fund?.totalExpense || 0)}
              </p>
              <p className="text-sm opacity-75">đồng</p>
            </div>
          </div>
          <div
            className="group relative bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 text-white p-6 md:p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-2xl"></div>
            <div className="relative">
              <div className="text-3xl mb-3">🏆</div>
              <h3 className="text-base md:text-lg font-semibold mb-3 opacity-90">
                Quỹ hiện tại
              </h3>
              <p className="text-3xl md:text-4xl font-bold mb-2">
                {formatCurrency(fund?.balance || 0)}
              </p>
              <p className="text-sm opacity-75">đồng</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <Link
            href="/members"
            className="group glass p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border-l-4 border-blue-500 animate-fade-in"
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
              👥
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-800 group-hover:text-blue-600 transition-colors">
              Members
            </h3>
            <p className="text-sm md:text-base text-gray-600">
              Xem tất cả thành viên
            </p>
            <div className="mt-4 text-blue-600 text-sm font-semibold group-hover:translate-x-2 transition-transform">
              Xem chi tiết →
            </div>
          </Link>

          <Link
            href="/penalties"
            className="group glass p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border-l-4 border-orange-500 animate-fade-in"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
              ⚠️
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-800 group-hover:text-orange-600 transition-colors">
              Phạt
            </h3>
            <p className="text-sm md:text-base text-gray-600">
              Xem danh sách phạt
            </p>
            <div className="mt-4 text-orange-600 text-sm font-semibold group-hover:translate-x-2 transition-transform">
              Xem chi tiết →
            </div>
          </Link>

          <Link
            href="/monthly-fees"
            className="group glass p-6 md:p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border-l-4 border-green-500 animate-fade-in"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
              💰
            </div>
            <h3 className="text-xl md:text-2xl font-bold mb-2 text-gray-800 group-hover:text-green-600 transition-colors">
              Quỹ tháng
            </h3>
            <p className="text-sm md:text-base text-gray-600">
              Xem danh sách nộp quỹ
            </p>
            <div className="mt-4 text-green-600 text-sm font-semibold group-hover:translate-x-2 transition-transform">
              Xem chi tiết →
            </div>
          </Link>

          <Link
            href="/fund"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              💵 Tổng quỹ
            </h3>
            <p className="text-gray-600">Xem chi tiết quỹ</p>
          </Link>

          <Link
            href="/debts"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition border-2 border-orange-300"
          >
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              🔴 Danh sách Nợ
            </h3>
            <p className="text-gray-600">Xem ai đang nợ phạt và quỹ</p>
          </Link>

          <Link
            href="/statistics"
            className="bg-white p-6 rounded-lg shadow hover:shadow-lg transition"
          >
            <h3 className="text-xl font-semibold mb-2 text-gray-800">
              📊 Thống kê
            </h3>
            <p className="text-gray-600">Xem thống kê thu chi</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
