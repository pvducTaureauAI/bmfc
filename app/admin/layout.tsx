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
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-lg md:text-2xl font-bold">
              ⚽ Bình Minh FC - Admin
            </h1>
            <div className="flex items-center gap-2">
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 px-3 md:px-4 py-2 rounded transition text-sm md:text-base"
              >
                Đăng xuất
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
          <div className="hidden md:flex space-x-4 pb-4">
            <Link
              href="/admin"
              className="hover:underline text-sm md:text-base"
            >
              Dashboard
            </Link>
            <Link
              href="/admin/members"
              className="hover:underline text-sm md:text-base"
            >
              Members
            </Link>
            <Link
              href="/admin/monthly-fees"
              className="hover:underline text-sm md:text-base"
            >
              Quỹ tháng
            </Link>
            <Link
              href="/admin/penalties"
              className="hover:underline text-sm md:text-base"
            >
              Phạt
            </Link>
            <Link
              href="/admin/expenses"
              className="hover:underline text-sm md:text-base"
            >
              Chi tiêu
            </Link>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden pb-4 space-y-2">
              <Link
                href="/admin"
                className="block hover:bg-blue-700 px-3 py-2 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              <Link
                href="/admin/members"
                className="block hover:bg-blue-700 px-3 py-2 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Members
              </Link>
              <Link
                href="/admin/monthly-fees"
                className="block hover:bg-blue-700 px-3 py-2 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Quỹ tháng
              </Link>
              <Link
                href="/admin/penalties"
                className="block hover:bg-blue-700 px-3 py-2 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Phạt
              </Link>
              <Link
                href="/admin/expenses"
                className="block hover:bg-blue-700 px-3 py-2 rounded"
                onClick={() => setIsMenuOpen(false)}
              >
                Chi tiêu
              </Link>
            </div>
          )}
        </div>
      </nav>
      <main className="container mx-auto px-4 py-4 md:py-8">{children}</main>
    </div>
  );
}
