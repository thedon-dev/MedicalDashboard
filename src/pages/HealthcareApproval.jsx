import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import TotalRequest from "../components/UserManagementComponents/TotalRequest";
import { url } from "../config";

const HealthcareApproval = () => {
  const liveUrl = "https://meddatabase-1.onrender.com";
  const localUrl = "http://localhost:3000";
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [err, setErr] = useState(null);
  const [allProviders2, setallProviders2] = useState([
    { name: "Doctors", requests: 0 },
    { name: "Pharmacy", requests: 0 },
    { name: "Laboratory", requests: 0 },
  ]);
  const [allProviders, setallProviders] = useState([]);
  const [Data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [providersPerPage] = useState(10);
  const [requestData, setRequestData] = useState([
    { name: "Doctors", requests: 0 },
    { name: "Pharmacy", requests: 0 },
    { name: "Laboratory", requests: 0 },
  ]);
  const [statusCounts, setStatusCounts] = useState({});
  const data = Object.entries(statusCounts).map(([name, requests]) => ({
    name,
    requests,
  }));
  const [adminId, setAdminId] = useState("");

  const fetchProviders = async () => {

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.get(`${url}/api/admin/approveRequest`);
      const fetchedData = response.data?.data;

      if (!fetchedData || typeof fetchedData !== "object") {
        throw new Error("Invalid API response structure");
      }

      const updatedRequestData = [
        { name: "Total Requests", requests: fetchedData.totalRequests },
        { name: "Approved Requests", requests: fetchedData.approved },
        { name: "Pending Requests", requests: fetchedData.pending },
        { name: "Rejected Requests", requests: fetchedData.rejected },
      ];

      let statusCounts = {};
      if (Array.isArray(fetchedData.providers)) {
        statusCounts = fetchedData.providers.reduce((acc, provider) => {
          const { status } = provider;
          acc[status] = (acc[status] || 0) + 1;
          return acc;
        }, {});
      } else {
        console.log("No providers array found in fetchedData");
      }

      setRequestData(updatedRequestData);

      setStatusCounts({
        totalRequest: fetchedData.totalRequests || 0,
        approved: fetchedData.approved || 0,
        pending: fetchedData.pending || 0,
        rejected: fetchedData.rejected || 0,
      });

      setProviders(fetchedData.providers || []);
    } catch (error) {
      console.error("Error fetching providers: ", error.message);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const adminId = JSON.parse(storedUserData);
      setAdminId(adminId.id);
      console.log(adminId.id)
    } else {
      console.log("no user ID")
    }



    const fetchDataFromApi = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          "https://backend-code-8vf0.onrender.com/api/admin/approveRequestList"
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        if (!result.success) {
          throw new Error("Failed to fetch data: success flag is false");
        }

        setData(result.data);

        const countProviders = result.data.reduce(
          (acc, provider) => {
            if (provider.type === "doctor") acc.doctors++;
            if (provider.type === "pharmacy") acc.pharmacy++;
            if (provider.type === "laboratory") acc.laboratory++;
            return acc;
          },
          { doctors: 0, pharmacy: 0, laboratory: 0 }
        );
        setallProviders(result.data);
        setallProviders2(countProviders);
      } catch (error) {
        console.error("Error during fetch:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDataFromApi();
  }, []);

  const handleApproval = async (provider) => {
    try {
      if (!allProviders.some((p) => p.id === provider.id)) {
        console.error("Provider ID not found in the list.");
        setMessage("Failed to approve provider.");
        return;
      }
      console.log(provider.id)
      console.log(provider.type)
      const response = await axios.put(
        `${url}/api/admin/set-approval-status/${adminId}`,
        {
          userId: provider.id,
          isApproved: "Approved",
          type: provider.type,
          rejectionNote: null,
        }
      );
      if (response.status === 200) {
        const data = allProviders.map((p) =>
          p.id === provider.id ? { ...p, status: "Approved" } : p
        );
        setallProviders(data);
      }

      setMessage("Provider approved successfully!");
      setSelectedProvider(null);
    } catch (error) {
      console.error("Error approving provider:", error.message);
      setMessage("Failed to approve provider.");
    } finally {
      setSelectedProvider(null);
    }
  };

  const handleRejection = async (id) => {
    try {
      await axios.patch(`${localUrl}/healthcareapprovals/${id}`, {
        status: "Rejected",
      });
      const updatedProviders = providers.map((provider) =>
        provider.id === id ? { ...provider, status: "Rejected" } : provider
      );
      setProviders(updatedProviders);
      setMessage("Provider rejected.");
      setSelectedProvider(null);
    } catch (error) {
      console.error("Error handling rejection:", error);
    } finally {
      window.location.reload();
    }
  };

  const openProviderDetails = (provider) => {
    setSelectedProvider(provider);
  };

  useEffect(() => {
    fetchProviders();
    window.scrollTo(0, 0);
  }, []);

  const indexOfLastProvider = currentPage * providersPerPage;
  const indexOfFirstProvider = indexOfLastProvider - providersPerPage;
  const currentProviders = allProviders.slice(
    indexOfFirstProvider,
    indexOfLastProvider
  );

  const totalPages = Math.ceil(allProviders.length / providersPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex flex-col items-center lg:p-4">
      <div className="w-full">
        <div className="">
          <TotalRequest
            providers={allProviders2}
            data={requestData}
            progressBar={allProviders2}
          />
        </div>
        <div className="">
          <h1 className="text-2xl font-bold w-full text-start mb-10">
            Requests
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

          {!isLoading && !error && allProviders.length === 0 && (
            <p className="text-gray-500">No providers waiting for approval.</p>
          )}

          {!isLoading && !error && allProviders.length > 0 && (
            <div className="w-full">
              <div className="w-full bg-white rounded-lg overflow-hidden shadow-md overflow-x-scroll lg:overflow-x-hidden">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="bg-[#3AD1F0] text-white text-sm uppercase">
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
                            provider.status == "Approved" ||
                            provider.status == "approved"
                              ? "text-green-500"
                              : provider.status == "Rejected" ||
                                provider.status == "rejected"
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
              <div className="flex gap-4 justify-center items-center mt-10">
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
          )}
        </div>
      </div>

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
                {Object.entries(selectedProvider.documents).map(
                  ([key, url], index) => (
                    <li key={index} className="mb-1">
                      <a
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline"
                      >
                        {key}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>
            {selectedProvider.showRejectionInput ? (
              <div>
                <textarea
                  className="w-full border border-gray-300 rounded p-2 mb-4"
                  rows="4"
                  placeholder="Enter reason for rejection"
                  value={selectedProvider.rejectionReason || ""}
                  onChange={(e) => {
                    const updatedProvider = {
                      ...selectedProvider,
                      rejectionReason: e.target.value,
                    };
                    setSelectedProvider(updatedProvider);
                  }}
                ></textarea>
                <div className="flex justify-end gap-4">
                  <button
                    onClick={() =>
                      handleRejection(
                        selectedProvider.id,
                        selectedProvider.rejectionReason
                      )
                    }
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  >
                    Submit Reason
                  </button>
                  <button
                    onClick={() =>
                      setSelectedProvider({
                        ...selectedProvider,
                        showRejectionInput: false,
                      })
                    }
                    className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => handleApproval(selectedProvider)}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Approve
                </button>
                <button
                  onClick={() =>
                    setSelectedProvider({
                      ...selectedProvider,
                      showRejectionInput: true,
                    })
                  }
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
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthcareApproval;
