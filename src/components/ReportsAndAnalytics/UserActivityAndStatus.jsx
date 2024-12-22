import React, { useState } from "react";

const UserActivityAndStatus = ({ userData }) => {
  const [dataPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(userData.length / dataPerPage);
  const indexOfLastData = currentPage * dataPerPage;
  const indexOfFirstData = indexOfLastData - dataPerPage;

  return (
    <>
      <div className="mt-6 rounded-lg bg-[#3AD1F0] overflow-hidden shadow-lg overflow-x-scroll lg:overflow-x-hidden">
        <table className="w-full border-collapse border-gray-300">
          <thead>
            <tr className="text-white">
              <th className="px-4 py-2 text-start">User ID</th>
              <th className="px-4 py-2 text-start">Name</th>
              <th className="px-4 py-2 text-start">Email</th>
              <th className="px-4 py-2 text-start">Status</th>
              <th className="px-4 py-2 text-start">Last Active</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {userData.map((user) => (
              <tr key={user.id}>
                <td className="px-4 py-2">{user.id}</td>
                <td className="text-nowrap px-4 py-2">{user.name}</td>
                <td className="px-4 py-2">{user.email}</td>
                <td
                  className={`px-4 py-2 ${
                    user.status === "active" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {user.status}
                </td>
                <td className="text-nowrap px-4 py-2">{user.lastActive}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        {Array.from(
          { length: Math.ceil(userData.length / dataPerPage) },
          (_, index) => (
            <button
              key={index}
              onClick={() => setCurrentPage(index + 1)}
              className={`mx-1 px-3 py-1 border ${
                currentPage === index + 1
                  ? "bg-[#3AD1F0] text-white"
                  : "bg-gray-200 text-gray-700"
              }`}
            >
              {index + 1}
            </button>
          )
        )}
      </div>
    </>
  );
};

export default UserActivityAndStatus;
