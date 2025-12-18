"use client";

import Link from "next/link";
import { useState } from "react";

export default function PublicPagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link
              href="/"
              className="text-xl md:text-2xl font-bold text-blue-600"
            >
              ⚽ Bình Minh FC
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex gap-4 xl:gap-6 items-center">
              <Link
                href="/members"
                className="text-gray-700 hover:text-blue-600 transition font-medium text-sm xl:text-base"
              >
                Members
              </Link>
              <Link
                href="/penalties"
                className="text-gray-700 hover:text-blue-600 transition font-medium text-sm xl:text-base"
              >
                Phạt
              </Link>
              <Link
                href="/monthly-fees"
                className="text-gray-700 hover:text-blue-600 transition font-medium text-sm xl:text-base"
              >
                Quỹ tháng
              </Link>
              <Link
                href="/fund"
                className="text-gray-700 hover:text-blue-600 transition font-medium text-sm xl:text-base"
              >
                Tổng quỹ
              </Link>
              <Link
                href="/debts"
                className="text-gray-700 hover:text-blue-600 transition font-medium text-sm xl:text-base"
              >
                Nợ
              </Link>
              <Link
                href="/statistics"
                className="text-gray-700 hover:text-blue-600 transition font-medium text-sm xl:text-base"
              >
                Thống kê
              </Link>
              <Link
                href="/login"
                className="bg-blue-600 text-white px-4 xl:px-6 py-2 rounded-lg hover:bg-blue-700 transition font-semibold text-sm xl:text-base"
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
      <main className="max-w-7xl mx-auto px-4 py-4 md:py-8">{children}</main>
    </div>
  );
}
