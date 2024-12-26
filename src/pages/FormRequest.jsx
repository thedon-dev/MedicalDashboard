import React, { useState, useEffect } from "react";
import axios from "axios";

const FormRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const requestsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const liveUrl = "https://meddatabase-1.onrender.com"
  const localUrl = "http://localhost:3000"

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          `${liveUrl}/contactRequests`
        );
        setRequests(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contact requests:", error);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const indexOfLastLog = currentPage * requestsPerPage;
  const indexOfFirstLog = indexOfLastLog - requestsPerPage;
  const currentLogs = requests.slice(indexOfFirstLog, indexOfLastLog);

  const totalPages = Math.ceil(requests.length / requestsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div>Loading requests...</div>;
  }

  return (
    <div className="lg:p-4">
      <h1 className="text-xl font-bold mb-4">Requests</h1>
      <div className="rounded-lg overflow-hidden shadow-lg overflow-x-scroll lg:overflow-x-hidden">
        <table className="min-w-full  border-collapse">
          <thead className="bg-[#3AD1F0]">
            <tr className="text-white">
              <th className="text-start p-2">ID</th>
              <th className="text-start p-2">Name</th>
              <th className="text-start p-2">Type</th>
              <th className="text-start p-2">Status</th>
              <th className="text-start p-2">Actions</th>
            </tr>
          </thead>
          <tbody className="">
            {currentLogs.map((request) => (
              <tr key={request.id}>
                <td className="p-2">{request.id}</td>
                <td className="p-2">{request.name}</td>
                <td className="p-2">{request.type}</td>
                <td className="p-2">{request.status}</td>
                <td className="p-2 text-nowrap">
                  <a
                    href={`/requests/${request.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    View Details
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-center mt-4">
        {Array.from(
          { length: Math.ceil(requests.length / requestsPerPage) },
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
    </div>
  );
};

export default FormRequest;
