import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa";
import { url } from "../config";

const VerificationPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [accountNumber, setAccountNumber] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [totalAmount, setTotalAmount] = useState(0);
  const [approvedNum, setApprovedNum] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [paymentsPerPage] = useState(10);
  const liveUrl = "https://meddatabase-1.onrender.com";
  const apiUrl = `${liveUrl}/api/admin/pendingWithdrawals`;
  const [adminId, setAdminId] = useState(null);

  const handleApproveClick = (transaction) => {
    setSelectedTransaction(transaction);
    setAccountNumber(""); // Reset account number input
    setBankCode(""); // Reset bank code input
    setMessage("");
  };

  const fetchTransactions = async (id) => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `${url}/api/auth/pending-withdrawals/${id}`
      );
      const fetchedTransactions = response.data.pendingWithdrawals;

      setTransactions(fetchedTransactions);
      const total = fetchedTransactions.reduce(
        (acc, item) => acc + item.amount,
        0
      );
      const approved = fetchedTransactions.filter(
        (transaction) => transaction.status === "approved"
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

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const user = JSON.parse(storedUserData);
      setAdminId(user.id);
    }
  }, []);

  useEffect(() => {
    if (adminId) {
      fetchTransactions(adminId);
    }
  }, [adminId]);

  const handleCheckOTPVerification = async (transaction) => {
    if (!otp) {
      setMessage("Please enter the OTP.");
      return;
    }

    try {
      const response = await axios.post(`${liveUrl}/api/verify-otp`, {
        TransactionId: transaction._id,
        Otp: otp,
      });

      if (response.status === 200 && response.data.success) {
        setTransactions((prev) =>
          prev.map((txn) =>
            txn._id === selectedTransaction._id
              ? { ...txn, status: "approved" }
              : txn
          )
        );
        setMessage("Transaction approved successfully!");
        setSelectedTransaction(null);
      } else {
        setMessage("OTP verification failed. Please try again.");
      }
    } catch (error) {
      console.error("Error verifying OTP:", error);
      setMessage("OTP verification failed. Please try again.");
    }
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
      <h1 className="text-start w-full text-2xl font-bold my-10"> Requests</h1>

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
                    key={transaction._id}
                    className="border-b text-gray-700 hover:bg-gray-100"
                  >
                    <td className="py-3 px-4">
                      {transaction.user.firstName} {transaction.user.lastName}
                    </td>
                    <td className="py-3 px-4">{transaction.type}</td>
                    <td className="py-3 px-4 text-right">
                      {transaction.amount}
                    </td>
                    <td
                      className={`py-3 px-4 text-center font-medium ${
                        transaction.status === "approved"
                          ? "text-green-500"
                          : transaction.status === "rejected"
                          ? "text-red-500"
                          : "text-yellow-500"
                      }`}
                    >
                      {transaction.status}
                    </td>
                    <td className="py-3 px-4 flex justify-center gap-2">
                      {transaction.status === "pending" && (
                        <>
                          <button
                            onClick={() =>
                              handleApproveClick(transaction)
                            }
                            className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              console.log(
                                `Reject transaction: ${transaction._id}`
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
          {selectedTransaction && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
              <div className="bg-white p-6 rounded-lg shadow-lg w-[90%] max-w-md">
                <h2 className="text-xl font-bold mb-4">Approve Transaction</h2>
                <p className="mb-2">
                  Transaction ID: {selectedTransaction._id}
                </p>

                {!otpSent ? (
                  <>
                    <input
                      type="text"
                      placeholder="Account Number"
                      value={accountNumber}
                      onChange={(e) => setAccountNumber(e.target.value)}
                      className="w-full mb-4 p-2 border rounded"
                    />
                    <input
                      type="text"
                      placeholder="Bank Code"
                      value={bankCode}
                      onChange={(e) => setBankCode(e.target.value)}
                      className="w-full mb-4 p-2 border rounded"
                    />
                    <button
                      onClick={handleSendApprovalClick}
                      className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                    >
                      Send OTP
                    </button>
                  </>
                ) : (
                  <>
                    <input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="w-full mb-4 p-2 border rounded"
                    />
                    <button
                      onClick={handleCheckOTPVerification}
                      className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                    >
                      Verify OTP
                    </button>
                  </>
                )}

                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600 mt-4"
                >
                  Cancel
                </button>
                {message && <p className="mt-4 text-blue-600">{message}</p>}
              </div>
            </div>
          )}
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

      {!isLoading && !error && transactions.length === 0 && (
        <p className="text-gray-500">No transactions waiting for approval.</p>
      )}
    </div>
  );
};

export default VerificationPage;
