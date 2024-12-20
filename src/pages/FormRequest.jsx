import React, { useState, useEffect } from "react";
import axios from "axios";

const FormRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const requestPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [requestsPerPage, setRecordsPerPage] = useState(5);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/contactRequests"
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
      <h1 className="text-2xl font-bold mb-4">Contact Form Requests</h1>
      <div className="rounded-lg overflow-hidden shadow-lg">
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
            {requests.map((request) => (
              <tr key={request.id}>
                <td className="p-2">{request.id}</td>
                <td className="p-2">{request.name}</td>
                <td className="p-2">{request.type}</td>
                <td className="p-2">{request.status}</td>
                <td className="p-2">
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
    </div>
  );
};

export default FormRequest;
