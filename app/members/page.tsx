"use client";

import { useEffect, useState } from "react";

interface Member {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  status: string;
  joinDate: string;
}

export default function GuestMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/members");
      if (res.ok) {
        setMembers(await res.json());
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading)
    return (
      <div className="text-center py-8 text-white">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-white flex items-center gap-3">
        <span className="text-4xl">👥</span>
        Danh sách Members
      </h1>

      {/* Desktop Table View */}
      <div className="hidden md:block glass rounded-2xl shadow-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
            <tr>
              <th className="px-3 lg:px-4 py-4 text-left font-semibold">ID</th>
              <th className="px-3 lg:px-4 py-4 text-left font-semibold">Tên</th>
              <th className="px-3 lg:px-4 py-4 text-left font-semibold">SĐT</th>
              <th className="px-3 lg:px-4 py-4 text-left font-semibold">
                Email
              </th>
              <th className="px-3 lg:px-4 py-4 text-left font-semibold">
                Trạng thái
              </th>
              <th className="px-3 lg:px-4 py-4 text-left font-semibold">
                Ngày tham gia
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((member, index) => (
              <tr
                key={member.id}
                className="border-b border-gray-200 hover:bg-white/50 transition-colors"
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <td className="px-3 lg:px-4 py-4 text-gray-800 font-bold">
                  {member.id}
                </td>
                <td className="px-3 lg:px-4 py-4 text-gray-800 font-semibold">
                  {member.name}
                </td>
                <td className="px-3 lg:px-4 py-4 text-gray-600">
                  {member.phone || "-"}
                </td>
                <td className="px-3 lg:px-4 py-4 text-gray-600">
                  {member.email || "-"}
                </td>
                <td className="px-3 lg:px-4 py-4">
                  <span
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                      member.status === "ACTIVE"
                        ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-md"
                        : "bg-gray-300 text-gray-700"
                    }`}
                  >
                    {member.status === "ACTIVE" ? "✓ Active" : "Inactive"}
                  </span>
                </td>
                <td className="px-3 lg:px-4 py-4 text-gray-600">
                  {new Date(member.joinDate).toLocaleDateString("vi-VN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {members.map((member, index) => (
          <div
            key={member.id}
            className="glass rounded-2xl shadow-lg p-5 hover:shadow-xl transition-all animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold text-lg text-gray-800">{member.name}</h3>
              <span
                className={`px-3 py-1.5 rounded-full text-xs font-semibold ${
                  member.status === "ACTIVE"
                    ? "bg-gradient-to-r from-green-400 to-emerald-500 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {member.status === "ACTIVE" ? "✓ Active" : "Inactive"}
              </span>
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">🆔</span>
                <span>{member.id}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">📱</span>
                <span>{member.phone || "-"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">✉️</span>
                <span>{member.email || "-"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-gray-800">📅</span>
                <span>
                  {new Date(member.joinDate).toLocaleDateString("vi-VN")}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
