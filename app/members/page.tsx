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

  if (loading) return <div className="text-center py-4">Đang tải...</div>;

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6 text-gray-800">
        Danh sách Members
      </h1>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-3 lg:px-4 py-3 text-left text-gray-700">ID</th>
              <th className="px-3 lg:px-4 py-3 text-left text-gray-700">Tên</th>
              <th className="px-3 lg:px-4 py-3 text-left text-gray-700">SĐT</th>
              <th className="px-3 lg:px-4 py-3 text-left text-gray-700">
                Email
              </th>
              <th className="px-3 lg:px-4 py-3 text-left text-gray-700">
                Trạng thái
              </th>
              <th className="px-3 lg:px-4 py-3 text-left text-gray-700">
                Ngày tham gia
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b hover:bg-gray-50">
                <td className="px-3 lg:px-4 py-3 text-gray-800">{member.id}</td>
                <td className="px-3 lg:px-4 py-3 text-gray-800 font-semibold">
                  {member.name}
                </td>
                <td className="px-3 lg:px-4 py-3 text-gray-800">
                  {member.phone || "-"}
                </td>
                <td className="px-3 lg:px-4 py-3 text-gray-800">
                  {member.email || "-"}
                </td>
                <td className="px-3 lg:px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      member.status === "ACTIVE"
                        ? "bg-green-200 text-green-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {member.status}
                  </span>
                </td>
                <td className="px-3 lg:px-4 py-3 text-gray-800">
                  {new Date(member.joinDate).toLocaleDateString("vi-VN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {members.map((member) => (
          <div key={member.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-gray-800">{member.name}</h3>
              <span
                className={`px-2 py-1 rounded text-xs ${
                  member.status === "ACTIVE"
                    ? "bg-green-200 text-green-800"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {member.status}
              </span>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <div>
                <span className="font-semibold">ID:</span> {member.id}
              </div>
              <div>
                <span className="font-semibold">SĐT:</span>{" "}
                {member.phone || "-"}
              </div>
              <div>
                <span className="font-semibold">Email:</span>{" "}
                {member.email || "-"}
              </div>
              <div>
                <span className="font-semibold">Ngày:</span>{" "}
                {new Date(member.joinDate).toLocaleDateString("vi-VN")}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
