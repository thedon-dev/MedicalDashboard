import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { BiUser } from "react-icons/bi";
import { BsPeople } from "react-icons/bs";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage, setRecordsPerPage] = useState(5);
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3000/users");
        setUsers(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const handleSuspend = async (userId) => {
    try {
      await axios.patch(`http://localhost:3000/users/${userId}`, {
        suspended: true,
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, suspended: true } : user
        )
      );

      alert("User account suspended successfully!");
    } catch (error) {
      console.error("Error suspending user:", error);
    }
  };

  const totalPages = Math.ceil(users.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = users.slice(indexOfFirstRecord, indexOfLastRecord);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handleRowClick = (userId) => {
    navigate(`/users/${userId}`);
  };

  if (loading) {
    return <p className="text-center text-lg">Loading users...</p>;
  }

  return (
    <div className="p-4 min-h-screen">
      <div className="grid grid-cols-2 lg:grid-cols-4">
        <div className="col-span-1 flex justify-between bg-green-700 rounded-lg p-5 text-white">
          <div className="flex flex-col gap-3">
            <h1 className="text-xl lg:text-3xl font-bold">Total Users</h1>
            <p className="text-2xl font-semibold">{users.length}</p>
          </div>
          <div className="">
            <div className="bg-white p-2 rounded-lg">
              <BsPeople color="green" size={30}/>
            </div>
          </div>
        </div>
      </div>
      <h1 className="text-3xl font-bold mb-10 mt-10">Users</h1>
      <div className="rounded-lg shadow-lg overflow-hidden">
        <table className="min-w-full bg-white rounded-lg">
          <thead>
            <tr className="bg-black text-white">
              <th className="py-3 px-4 text-left">Name</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Role</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b hover:bg-gray-100 cursor-pointer"
                onClick={() => handleRowClick(user.id)}
              >
                <td className="py-3 px-4">{user.name}</td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4 capitalize">{user.role}</td>
                <td className="py-3 px-4">
                  {user.suspended ? (
                    <span className="text-red-500 font-semibold">
                      Suspended
                    </span>
                  ) : (
                    <span className="text-green-500 font-semibold">Active</span>
                  )}
                </td>
                <td
                  className="py-3 px-4 text-center"
                  onClick={(e) => e.stopPropagation()} // Prevent row click
                >
                  {!user.suspended && (
                    <button
                      onClick={() => handleSuspend(user.id)}
                      className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                    >
                      Suspend
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center gap-4 justify-center mt-10">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded ${
            currentPage === 1
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          <FaAngleLeft />
        </button>

        <span className="font-bold text-lg">{currentPage}</span>

        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded ${
            currentPage === totalPages
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          <FaAngleRight />
        </button>
      </div>
    </div>
  );
};

export default UserManagement;
