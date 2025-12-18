"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ReactNode } from "react";

export default function GuestLayout({ children }: { children: ReactNode }) {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-green-600 text-white shadow-lg">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold">⚽ Bình Minh FC</h1>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded transition"
            >
              Đăng xuất
            </button>
          </div>
          <div className="flex space-x-4 pb-4">
            <Link href="/guest" className="hover:underline">
              Dashboard
            </Link>
            <Link href="/guest/members" className="hover:underline">
              Members
            </Link>
            <Link href="/guest/penalties" className="hover:underline">
              Phạt hôm nay
            </Link>
            <Link href="/guest/monthly-fees" className="hover:underline">
              Quỹ tháng
            </Link>
            <Link href="/guest/fund" className="hover:underline">
              Tổng quỹ
            </Link>
            <Link href="/guest/statistics" className="hover:underline">
              Thống kê
            </Link>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
