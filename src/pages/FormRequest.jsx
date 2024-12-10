import React, { useState, useEffect } from "react";
import axios from "axios";

const FormRequest = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://localhost:3000/contactRequests");
        setRequests(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching contact requests:", error);
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  if (loading) {
    return <div>Loading requests...</div>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Contact Form Requests</h1>
      <table className="min-w-full border-collapse border border-gray-300">
        <thead>
          <tr>
            <th className="border border-gray-300 p-2">ID</th>
            <th className="border border-gray-300 p-2">Name</th>
            <th className="border border-gray-300 p-2">Type</th>
            <th className="border border-gray-300 p-2">Status</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {requests.map((request) => (
            <tr key={request.id}>
              <td className="border border-gray-300 p-2">{request.id}</td>
              <td className="border border-gray-300 p-2">{request.name}</td>
              <td className="border border-gray-300 p-2">{request.type}</td>
              <td className="border border-gray-300 p-2">{request.status}</td>
              <td className="border border-gray-300 p-2">
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
  );
};

export default FormRequest;
