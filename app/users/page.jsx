"use client";

import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { UserAPI } from "../services/api";

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ full_name: "", role: "" });
  const [confirmDelete, setConfirmDelete] = useState(null);

  // 🧭 Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  // Fetch all users
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await UserAPI.list();
      setUsers(
        response.data.data.map((user) => ({
          ...user,
          is_active: user.is_active ?? true,
        }))
      );
    } catch (err) {
      toast.error("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  // Filter users
  const filteredUsers = users.filter(
    (user) =>
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.full_name &&
        user.full_name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // 🔢 Pagination calculations
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const handlePageChange = (pageNumber) => setCurrentPage(pageNumber);

  // Block user
  const blockUser = async (userId) => {
    try {
      await UserAPI.block(userId);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, is_active: false } : user
        )
      );
      toast.info("User blocked successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to block user");
    }
  };

  // Unblock user
  const unblockUser = async (userId) => {
    try {
      await UserAPI.unblock(userId);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, is_active: true } : user
        )
      );
      toast.success("User unblocked successfully");
    } catch (err) {
      console.error(err);
      toast.error("Failed to unblock user");
    }
  };

  // Delete user
  const deleteUser = async (userId) => {
    try {
      await UserAPI.delete(userId);
      setUsers(users.filter((user) => user.id !== userId));
      toast.success("User deleted successfully");
      setConfirmDelete(null);
    } catch (err) {
      toast.error("Failed to delete user");
    }
  };

  // Start editing user
  const startEditing = (user) => {
    setEditingUser(user.id);
    setFormData({ full_name: user.full_name || "", role: user.role });
  };

  // Handle form changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Update user
  const updateUser = async (userId) => {
    try {
      const response = await UserAPI.update(userId, formData);
      setUsers(
        users.map((user) => (user.id === userId ? response.data.data : user))
      );
      setEditingUser(null);
      setFormData({ full_name: "", role: "" });
      toast.success("User updated successfully");
    } catch (err) {
      toast.error("Failed to update user");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="bg-white shadow-md rounded-lg p-6 ">
      {/* 🔍 Search box */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by email or name"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // reset to first page on search
          }}
          className="w-full p-2 border rounded-md"
        />
      </div>

      {/* 🧭 Loading or content */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <>
          {/* Table view for xl screens */}
          <div className="hidden xl:block">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-200">
                  <th className="p-2 text-left">ID</th>
                  <th className="p-2 text-left">Name</th>
                  <th className="p-2 text-left">Email</th>
                  <th className="p-2 text-left">Role</th>
                  <th className="p-2 text-left">Status</th>
                  <th className="p-2 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user.id} className="border-b">
                    <td className="p-2">{user.id}</td>
                    <td className="p-2">
                      {editingUser === user.id ? (
                        <input
                          type="text"
                          name="full_name"
                          value={formData.full_name}
                          onChange={handleInputChange}
                          className="p-1 border rounded-md w-full"
                        />
                      ) : (
                        user.full_name || "N/A"
                      )}
                    </td>
                    <td className="p-2">{user.email}</td>
                    <td className="p-2">
                      {editingUser === user.id ? (
                        <select
                          name="role"
                          value={formData.role}
                          onChange={handleInputChange}
                          className="p-1 border rounded-md w-full"
                        >
                          <option value="admin">Admin</option>
                          <option value="publisher">Publisher</option>
                          <option value="editor">Editor</option>
                        </select>
                      ) : (
                        user.role
                      )}
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded-full text-white text-sm ${
                          user.is_active ? "bg-green-500" : "bg-red-500"
                        }`}
                      >
                        {user.is_active ? "Active" : "Blocked"}
                      </span>
                    </td>
                    <td className="p-2 flex space-x-2">
                      {editingUser === user.id ? (
                        <>
                          <button
                            onClick={() => updateUser(user.id)}
                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingUser(null)}
                            className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditing(user)}
                            className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => blockUser(user.id)}
                            disabled={!user.is_active}
                            className={`px-3 py-1 rounded-md text-white ${
                              user.is_active
                                ? "bg-red-500 hover:bg-red-600"
                                : "bg-gray-400"
                            }`}
                          >
                            Block
                          </button>
                          <button
                            onClick={() => unblockUser(user.id)}
                            disabled={user.is_active}
                            className={`px-3 py-1 rounded-md text-white ${
                              !user.is_active
                                ? "bg-green-500 hover:bg-green-600"
                                : "bg-gray-400"
                            }`}
                          >
                            Unblock
                          </button>
                          <button
                            onClick={() => setConfirmDelete(user)}
                            className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white rounded-md"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card view for mobile screens */}
          <div className="block xl:hidden space-y-4">
            {currentUsers.map((user) => (
              <div key={user.id} className="border rounded-md p-4 shadow-sm">
                <div className="mb-2">
                  <span className="font-bold">ID:</span> {user.id}
                </div>
                <div className="mb-2">
                  <span className="font-bold">Name:</span>{" "}
                  {editingUser === user.id ? (
                    <input
                      type="text"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleInputChange}
                      className="p-1 border rounded-md w-full mt-1"
                    />
                  ) : (
                    user.full_name || "N/A"
                  )}
                </div>
                <div className="mb-2">
                  <span className="font-bold">Email:</span> {user.email}
                </div>
                <div className="mb-2">
                  <span className="font-bold">Role:</span>{" "}
                  {editingUser === user.id ? (
                    <select
                      name="role"
                      value={formData.role}
                      onChange={handleInputChange}
                      className="p-1 border rounded-md w-full mt-1"
                    >
                      <option value="admin">Admin</option>
                      <option value="publisher">Publisher</option>
                      <option value="editor">Editor</option>
                    </select>
                  ) : (
                    user.role
                  )}
                </div>
                <div className="mb-2">
                  <span className="font-bold">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-white text-sm ${
                      user.is_active ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {user.is_active ? "Active" : "Blocked"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  {editingUser === user.id ? (
                    <>
                      <button
                        onClick={() => updateUser(user.id)}
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingUser(null)}
                        className="px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded-md"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => startEditing(user)}
                        className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => blockUser(user.id)}
                        disabled={!user.is_active}
                        className={`px-3 py-1 rounded-md text-white ${
                          user.is_active
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-gray-400"
                        }`}
                      >
                        Block
                      </button>
                      <button
                        onClick={() => unblockUser(user.id)}
                        disabled={user.is_active}
                        className={`px-3 py-1 rounded-md text-white ${
                          !user.is_active
                            ? "bg-green-500 hover:bg-green-600"
                            : "bg-gray-400"
                        }`}
                      >
                        Unblock
                      </button>
                      <button
                        onClick={() => setConfirmDelete(user)}
                        className="px-3 py-1 bg-red-700 hover:bg-red-800 text-white rounded-md"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* 🧭 Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center gap-2 mt-6">
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 bg-gray-300 rounded-md disabled:opacity-50"
              >
                Prev
              </button>

              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-3 py-1 rounded-md ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  {index + 1}
                </button>
              ))}

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 bg-gray-300 rounded-md disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}

      {/* 🧾 Delete Confirmation */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg w-96 text-center">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-6">
              Are you sure you want to delete{" "}
              <span className="font-bold text-red-600">
                {confirmDelete.full_name || confirmDelete.email}
              </span>
              ?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => deleteUser(confirmDelete.id)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
              >
                Yes, Delete
              </button>
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 bg-gray-400 hover:bg-gray-500 text-white rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="colored"
      />
    </div>
  );
}
