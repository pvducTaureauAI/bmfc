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

export default function AdminMembersPage() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const res = await fetch("/api/members");
      if (res.ok) {
        const data = await res.json();
        setMembers(data);
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        // Update
        const res = await fetch(`/api/members/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          alert("Cập nhật thành công!");
        }
      } else {
        // Create
        const res = await fetch("/api/members", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });
        if (res.ok) {
          alert("Thêm thành công!");
        }
      }
      setFormData({ name: "", phone: "", email: "" });
      setShowForm(false);
      setEditingId(null);
      fetchMembers();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleEdit = (member: Member) => {
    setFormData({
      name: member.name,
      phone: member.phone || "",
      email: member.email || "",
    });
    setEditingId(member.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa?")) return;
    try {
      const res = await fetch(`/api/members/${id}`, { method: "DELETE" });
      if (res.ok) {
        alert("Xóa thành công!");
        fetchMembers();
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  if (loading) return <div>Đang tải...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Quản lý Members</h1>
        <button
          onClick={() => {
            setShowForm(!showForm);
            setEditingId(null);
            setFormData({ name: "", phone: "", email: "" });
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {showForm ? "Đóng" : "+ Thêm Member"}
        </button>
      </div>

      {showForm && (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">
            {editingId ? "Sửa Member" : "Thêm Member mới"}
          </h2>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Tên *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full px-3 py-2 border rounded text-gray-800"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Số điện thoại
              </label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full px-3 py-2 border rounded text-gray-800"
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full px-3 py-2 border rounded text-gray-800"
              />
            </div>
            <button
              type="submit"
              className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
            >
              {editingId ? "Cập nhật" : "Thêm"}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-4 py-3 text-left text-gray-700">ID</th>
              <th className="px-4 py-3 text-left text-gray-700">Tên</th>
              <th className="px-4 py-3 text-left text-gray-700">SĐT</th>
              <th className="px-4 py-3 text-left text-gray-700">Email</th>
              <th className="px-4 py-3 text-left text-gray-700">Trạng thái</th>
              <th className="px-4 py-3 text-left text-gray-700">Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {members.map((member) => (
              <tr key={member.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 text-gray-800">{member.id}</td>
                <td className="px-4 py-3 text-gray-800">{member.name}</td>
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
                <td className="px-4 py-3">
                  <button
                    onClick={() => handleEdit(member)}
                    className="text-blue-600 hover:underline mr-3"
                  >
                    Sửa
                  </button>
                  <button
                    onClick={() => handleDelete(member.id)}
                    className="text-red-600 hover:underline"
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
