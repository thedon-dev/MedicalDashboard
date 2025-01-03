import axios from "axios";
import React, { useEffect, useState } from "react";
import { url } from "../config";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";

const VerificationPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [approvedNum, setApprovedNum] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentsPerPage] = useState(10);
  const liveUrl = "https://meddatabase-1.onrender.com";
  const localUrl = "http://localhost:3000";

  const handleApproveClick = (transaction) => {
    setSelectedTransaction(transaction);
    setMessage("");
  };

  const fetchTransactions = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.get(`${url}/api/admin/approveRequest`);
      setTransactions(response.data);

      const total = response.data.reduce((acc, item) => acc + item.amount, 0);
      const approved = response.data.filter(
        (transaction) => transaction.status === "Approved"
      );
      setApprovedNum(approved.length);
      setTotalAmount(total);
    } catch (err) {
      setError(err.message || "Failed to fetch transactions.");
    } finally {
      setIsLoading(false);
    }
  };

  const indexOfLastLog = currentPage * paymentsPerPage;
  const indexOfFirstLog = indexOfLastLog - paymentsPerPage;
  const currentLogs = transactions.slice(indexOfFirstLog, indexOfLastLog);

  const totalPages = Math.ceil(transactions.length / paymentsPerPage);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleRejectClick = async (transaction, rejectionNote) => {
    try {
      const response = await axios.put(
        `${localUrl}/api/admin/set-approval-status/${transaction.adminId}`,
        {
          userId: transaction.userId,
          isApproved: false,
          type: transaction.type,
          rejectionNote: rejectionNote || "No specific reason provided.",
        }
      );

      setTransactions((prev) =>
        prev.map((txn) =>
          txn.id === transaction.id ? { ...txn, status: "Rejected" } : txn
        )
      );
      setMessage("Transaction rejected successfully!");
    } catch (error) {
      console.error("Error rejecting transaction:", error);
      setMessage("Failed to reject transaction. Please try again.");
    }
  };

  const handleVerifyOtp = () => {
    if (!otp) {
      setMessage("Please enter an OTP.");
      return;
    }

    new Promise((resolve, reject) => {
      setTimeout(() => {
        otp === "123456" ? resolve() : reject(new Error("Invalid OTP"));
      }, 1000);
    })
      .then(() => {
        axios
          .patch(`${liveUrl}/paymentverification/${selectedTransaction.id}`, {
            status: "Approved",
          })
          .then(() => {
            setTransactions((prev) =>
              prev.map((txn) =>
                txn.id === selectedTransaction.id
                  ? { ...txn, status: "Approved" }
                  : txn
              )
            );
            window.location.reload();
            setMessage("Transaction approved successfully!");
            setSelectedTransaction(null);
          })
          .catch((error) => {
            console.error("Error updating transaction:", error);
            setMessage(
              "Failed to approve transaction. Please try again later."
            );
          });
      })
      .catch(() => {
        setMessage("Invalid OTP. Please try again.");
      })
      .finally(() => {
        setOtp("");
      });
  };

  return (
    <div className="flex flex-col items-center md:p-4">
      <div className="flex w-full">
        <h1 className="text-2xl font-bold text-start mb-10">Metrics</h1>
      </div>
      <div className="w-full flex flex-wrap gap-5 text-white">
        <div className="bg-[#3AD1F0] w-[20rem] flex gap-3 justify-between shadow-lg rounded-lg p-4">
          <div className="flex gap-4 items-center">
            <h1 className="text-xl font-semibold text-nowrap">
              Total Requests
            </h1>
            <p className="text-2xl font-bold">{transactions.length}</p>
          </div>
        </div>
        <div className="bg-yellow-400 w-[20rem] flex justify-between shadow-lg rounded-lg p-4">
          <div className="flex gap-4 items-center">
            <h1 className="text-xl font-semibold text-nowrap">Total Amount</h1>
            <p className="text-2xl font-bold">NGN{totalAmount}</p>
          </div>
        </div>
        <div className="bg-green-500 w-[20rem] flex justify-between shadow-lg rounded-lg p-4 text-back">
          <div className="flex gap-4 items-center">
            <h1 className="text-xl font-semibold text-nowrap">Approved</h1>
            <p className="text-2xl font-bold">{approvedNum}</p>
          </div>
        </div>
      </div>
      <h1 className="text-start w-full text-2xl font-bold my-10">Requests</h1>

      {isLoading && <p className="text-blue-500">Loading transactions...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!isLoading && !error && currentLogs.length > 0 && (
        <div className="w-full">
          <div className="w-full bg-white rounded-lg overflow-hidden shadow-md overflow-x-scroll lg:overflow-auto">
            <table className="w-full border-collapse text-nowrap">
              <thead>
                <tr className="bg-black text-white text-sm uppercase">
                  <th className="py-3 px-4 text-left">Provider</th>
                  <th className="py-3 px-4 text-left">Type</th>
                  <th className="py-3 px-4 text-right">Amount</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentLogs.map((transaction) => (
                  <tr
                    key={transaction.id}
                    className="border-b text-gray-700 hover:bg-gray-100"
                  >
                    <td className="py-3 px-4">{transaction.user}</td>
                    <td className="py-3 px-4">{transaction.type}</td>
                    <td className="py-3 px-4 text-right">
                      {transaction.amount}
                    </td>
                    <td
                      className={`py-3 px-4 text-center font-medium ${
                        transaction.status === "Approved"
                          ? "text-green-500"
                          : transaction.status === "Rejected"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {transaction.status}
                    </td>
                    <td className="py-3 px-4 flex justify-center gap-2">
                      {transaction.status === "Pending" && (
                        <>
                          <button
                            onClick={() => handleApproveClick(transaction)}
                            className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleRejectClick(
                                transaction,
                                "Specify your reason"
                              )
                            }
                            className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
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

      {/* OTP Verification Modal */}
      {selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center">
          {message && (
            <div
              className={`mb-4 px-4 py-2 rounded text-white ${
                message.includes("approved") ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {message}
            </div>
          )}
          <div className="bg-white w-full max-w-sm rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold mb-4">Verify OTP</h2>
            <p className="text-gray-700 mb-4">
              Enter the OTP sent to your registered contact to approve the
              transaction for <strong>{selectedTransaction.provider}</strong>.
            </p>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              className="w-full mb-4 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-4">
              <button
                onClick={handleVerifyOtp}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Verify
              </button>
              <button
                onClick={() => setSelectedTransaction(null)}
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {!isLoading && !error && transactions.length === 0 && (
        <p className="text-gray-500">No transactions waiting for approval.</p>
      )}
    </div>
  );
};

export default VerificationPage;
