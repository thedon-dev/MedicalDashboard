import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const HealthcareApproval = () => {
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [providersPerPage] = useState(10); // Number of items per page

  const fetchProviders = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.get(
        "http://localhost:3000/healthcareapprovals"
      ); // Replace with your main server API
      setProviders(response.data);
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproval = async (id) => {
    try {
      await axios.patch(`http://localhost:3000/healthcareapprovals/${id}`, {
        status: "approved",
      });
      const updatedProviders = providers.map((provider) =>
        provider.id === id ? { ...provider, status: "Approved" } : provider
      );
      setProviders(updatedProviders);
      setMessage("Provider approved successfully!");
      setSelectedProvider(null);
    } catch (error) {
      console.error("Error handling approval:", error);
    }
  };

  const handleRejection = async (id) => {
    try {
      await axios.patch(`http://localhost:3000/healthcareapprovals/${id}`, {
        status: "rejected",
      });
      const updatedProviders = providers.map((provider) =>
        provider.id === id ? { ...provider, status: "Rejected" } : provider
      );
      setProviders(updatedProviders);
      setMessage("Provider rejected.");
      setSelectedProvider(null);
    } catch (error) {
      console.error("Error handling rejection:", error);
    }
  };

  const openProviderDetails = (provider) => {
    setSelectedProvider(provider);
  };

  useEffect(() => {
    fetchProviders();
  }, []);

  // Pagination Logic
  const indexOfLastProvider = currentPage * providersPerPage;
  const indexOfFirstProvider = indexOfLastProvider - providersPerPage;
  const currentProviders = providers.slice(
    indexOfFirstProvider,
    indexOfLastProvider
  );

  const totalPages = Math.ceil(providers.length / providersPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold w-full text-start mb-10">
        Healthcare Provider Requests
      </h1>

      {message && (
        <div
          className={`mb-4 px-4 py-2 rounded text-white ${
            message.includes("approved") ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message}
        </div>
      )}

      {isLoading && <p>Loading...</p>}

      {!isLoading && !error && currentProviders.length === 0 && (
        <p className="text-gray-500">No providers waiting for approval.</p>
      )}

      {!isLoading && !error && currentProviders.length > 0 && (
        <div className="w-full">
          <div className="w-full bg-white rounded-lg overflow-hidden shadow-md">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-black text-white text-sm uppercase">
                  <th className="py-3 px-4 text-left">Name</th>
                  <th className="py-3 px-4 text-left">Type</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Documents</th>
                </tr>
              </thead>
              <tbody>
                {currentProviders.map((provider) => (
                  <tr
                    key={provider.id}
                    className="border-b text-gray-700 hover:bg-gray-100"
                  >
                    <td className="py-3 px-4">{provider.name}</td>
                    <td className="py-3 px-4">{provider.type}</td>
                    <td
                      className={`py-3 px-4 text-center font-medium ${
                        provider.status === "Approved"
                          ? "text-green-500"
                          : provider.status === "Rejected"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {provider.status}
                    </td>
                    <td className="py-3 px-4 flex justify-center gap-2">
                      {provider.status === "Pending" && (
                        <button
                          onClick={() => openProviderDetails(provider)}
                          className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                        >
                          Review
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Pagination */}
          <div className="flex justify-center items-center mt-4">
            {Array.from({ length: totalPages }, (_, index) => (
              <div className="flex gap-2 items-center">
                <button
                  key={index}
                  onClick={() => handlePageChange(index - 1)}
                  className={`px-4 py-2 mx-1 rounded ${
                    currentPage === index + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  <FaAngleLeft />
                </button>
                <p className="">{index + 1}</p>
                <button
                  key={index}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 mx-1 rounded ${
                    currentPage === index + 1
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300"
                  }`}
                >
                  <FaAngleRight />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal for viewing provider details */}
      {selectedProvider && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white w-full max-w-lg rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">
              Review {selectedProvider.name}
            </h2>
            <p className="text-gray-700 mb-2">
              <strong>Type:</strong> {selectedProvider.type}
            </p>
            <p className="text-gray-700 mb-4">
              <strong>Status:</strong> {selectedProvider.status}
            </p>
            <div className="mb-4">
              <h3 className="font-semibold text-gray-700">Documents:</h3>
              <ul className="list-disc pl-5">
                {selectedProvider.documents.map((doc, index) => (
                  <li key={index} className="mb-1">
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {doc.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => handleApproval(selectedProvider.id)}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Approve
              </button>
              <button
                onClick={() => handleRejection(selectedProvider.id)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Reject
              </button>
              <button
                onClick={() => setSelectedProvider(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthcareApproval;
