import axios from "axios";
import React, { useEffect, useState } from "react";

const VerificationPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleApproveClick = (transaction) => {
    setSelectedTransaction(transaction);
    setMessage("");
  };

  const fetchTransactions = async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await axios.get("http://localhost:3000/paymentverification"); // use this for the real API call
    //   const response = await dummyAPI();
      setTransactions(response.data);
      console.log(response.data)
    } catch (err) {
      setError(err.message || "Failed to fetch transactions.");
    } finally {
      setIsLoading(false);
    }
  };

  const dummyAPI = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const success = true;
        if (success) {
          resolve({
            transactions: [
              {
                id: 1,
                provider: "Dr. Sarah Johnson",
                type: "Payout",
                amount: "$500",
                status: "Pending",
              },
              {
                id: 2,
                provider: "MedCare Pharmacy",
                type: "Payout",
                amount: "$1200",
                status: "Pending",
              },
              {
                id: 3,
                provider: "LabPro Diagnostics",
                type: "Payout",
                amount: "$300",
                status: "Pending",
              },
            ],
          });
        } else {
          reject(new Error("Failed to fetch transactions."));
        }
      }, 2000);
    });
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const handleVerifyOtp = () => {
    if (!otp) {
      setMessage("Please enter an OTP.");
      return;
    }

    new Promise((resolve, reject) => {
      setTimeout(() => {
        otp === "123456" ? resolve() : reject(new Error("invalid OTP"));
      }, 1000);
    })
      .then(() => {
        setTransactions((prev) =>
          prev.map((txn) =>
            txn.id === selectedTransaction.id
              ? { ...txn, status: "Approved" }
              : txn
          )
        );
        setMessage("Transaction approved successfully!");
        setSelectedTransaction(null);
      })
      .catch(() => {
        setMessage("Invalid OTP. Please try again.");
      })
      .finally(() => {
        setOtp("");
      });
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-start w-full text-3xl font-bold mb-10">
        Payouts Requests
      </h1>

      {isLoading && <p className="text-blue-500">Loading transactions...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!isLoading && !error && transactions.length > 0 && (
        <div className="w-full bg-white rounded-lg overflow-hidden shadow-md">
          <table className="w-full border-collapse">
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
              {transactions.map((transaction) => (
                <tr
                  key={transaction.id}
                  className="border-b text-gray-700 hover:bg-gray-100"
                >
                  <td className="py-3 px-4">{transaction.user}</td>
                  <td className="py-3 px-4">{transaction.type}</td>
                  <td className="py-3 px-4 text-right">{transaction.amount}</td>
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
                      <button
                        onClick={() => handleApproveClick(transaction)}
                        className="px-4 py-2 text-sm text-white bg-blue-600 rounded hover:bg-blue-700"
                      >
                        Approve
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
