"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ReactNode, useState } from "react";

export default function AdminLayout({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen">
      <nav className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-lg md:text-2xl font-bold flex items-center gap-2 hover:scale-105 transition-transform">
              <span className="text-3xl">⚽</span>
              <span>Bình Minh FC</span>
              <span className="hidden md:inline text-white/80 text-base font-normal">
                - Admin
              </span>
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 px-3 md:px-4 py-2 rounded-lg transition-all hover:shadow-lg hover:scale-105 text-sm md:text-base font-semibold"
              >
                🚪 Đăng xuất
              </button>
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2"
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
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex gap-2 pb-4">
            <Link
              href="/admin"
              className="px-4 py-2 rounded-lg hover:bg-white/20 transition-all text-sm md:text-base font-medium backdrop-blur-sm"
            >
              📊 Dashboard
            </Link>
            <Link
              href="/admin/members"
              className="px-4 py-2 rounded-lg hover:bg-white/20 transition-all text-sm md:text-base font-medium backdrop-blur-sm"
            >
              👥 Members
            </Link>
            <Link
              href="/admin/monthly-fees"
              className="px-4 py-2 rounded-lg hover:bg-white/20 transition-all text-sm md:text-base font-medium backdrop-blur-sm"
            >
              💰 Quỹ tháng
            </Link>
            <Link
              href="/admin/penalties"
              className="px-4 py-2 rounded-lg hover:bg-white/20 transition-all text-sm md:text-base font-medium backdrop-blur-sm"
            >
              ⚠️ Phạt
            </Link>
            <Link
              href="/admin/expenses"
              className="px-4 py-2 rounded-lg hover:bg-white/20 transition-all text-sm md:text-base font-medium backdrop-blur-sm"
            >
              💸 Chi tiêu
            </Link>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 space-y-2 animate-slide-in">
              <Link
                href="/admin"
                className="block hover:bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                📊 Dashboard
              </Link>
              <Link
                href="/admin/members"
                className="block hover:bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                👥 Members
              </Link>
              <Link
                href="/admin/monthly-fees"
                className="block hover:bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                💰 Quỹ tháng
              </Link>
              <Link
                href="/admin/penalties"
                className="block hover:bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                ⚠️ Phạt
              </Link>
              <Link
                href="/admin/expenses"
                className="block hover:bg-white/20 px-3 py-2 rounded-lg backdrop-blur-sm"
                onClick={() => setIsMenuOpen(false)}
              >
                💸 Chi tiêu
              </Link>
            </div>
          )}
        </div>
      </nav>
      <main className="container mx-auto px-4 py-4 md:py-8 animate-fade-in">
        {children}
      </main>
    </div>
  );
}
