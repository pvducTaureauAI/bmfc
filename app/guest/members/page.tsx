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

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-gray-800">
        Danh sách Members
      </h1>

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-gray-700">ID</th>
              <th className="px-4 py-3 text-left text-gray-700">Tên</th>
              <th className="px-4 py-3 text-left text-gray-700">SĐT</th>
              <th className="px-4 py-3 text-left text-gray-700">Email</th>
              <th className="px-4 py-3 text-left text-gray-700">Trạng thái</th>
              <th className="px-4 py-3 text-left text-gray-700">
                Ngày tham gia
              </th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-800">{member.id}</td>
                <td className="px-4 py-3 text-gray-800 font-semibold">
                  {member.name}
                </td>
                <td className="px-4 py-3 text-gray-800">
                  {member.phone || "-"}
                </td>
                <td className="px-4 py-3 text-gray-800">
                  {member.email || "-"}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-1 rounded text-sm ${
                      member.status === "ACTIVE"
                        ? "bg-green-200 text-green-800"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    {member.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-800">
                  {new Date(member.joinDate).toLocaleDateString("vi-VN")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
