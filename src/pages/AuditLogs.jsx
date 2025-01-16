import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { url } from "../config";

ChartJS.register(BarElement, CategoryScale, LinearScale);

const TransactionLogs = () => {
  const [email, setEmail] = useState("");
  const [transactionLogs, setTransactionLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [adminId, setAdminId] = useState(null);
  const transactionsPerPage = 20;

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const user = JSON.parse(storedUserData);
      setAdminId(user.id);
    }
  }, []);

  const handleSearch = async () => {
    if (!email.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post(
        `${url}/api/admin/${adminId}/user-transactions`,
        { email }
      );
      const transactions = response.data.transactions;
      const inflow = transactions
        .filter((tx) => tx.type === "wallet funding")
        .reduce((acc, tx) => acc + tx.amount, 0);
      const outflow = transactions
        .filter((tx) => tx.type !== "wallet funding")
        .reduce((acc, tx) => acc + tx.amount, 0);

      setChartData({
        labels: ["Inflow", "Outflow"],
        datasets: [
          {
            label: "Transaction Summary",
            data: [inflow, outflow],
            backgroundColor: ["#4CAF50", "#F44336"],
          },
        ],
      });

      setTransactionLogs(transactions);
      setCurrentPage(1); // Reset to the first page
    } catch (error) {
      console.error("Error fetching transaction logs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Pagination logic
  const indexOfLastTransaction = currentPage * transactionsPerPage;
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage;
  const currentTransactions = transactionLogs.slice(
    indexOfFirstTransaction,
    indexOfLastTransaction
  );

  const totalPages = Math.ceil(transactionLogs.length / transactionsPerPage);

  return (
    <div className="min-h-screen">
      <h1 className="text-2xl font-bold mb-5">Transaction Logs</h1>

      {/* Search Bar */}
      <div className="mb-5">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter user email"
          className="border border-gray-300 rounded p-2 w-fit lg:w-full max-w-md"
        />
        <button
          onClick={handleSearch}
          className="bg-[#3AD1F0] text-white px-4 py-2 rounded ml-2"
          disabled={loading}
        >
          {loading ? "Searching..." : "Search"}
        </button>
      </div>

      <div className="lg:w-1/2">
        {chartData && (
          <div className="mb-5">
            <h3 className="font-semibold mb-2">Transaction Summary</h3>
            <Bar data={chartData} />
          </div>
        )}
      </div>

      {/* Transaction Logs */}
      {transactionLogs.length > 0 && (
        <div>
          <div className="bg-white shadow rounded-lg lg:overflow-hidden overflow-x-scroll">
            <table className="w-full text-left border-collapse">
              <thead className="bg-[#3AD1F0]">
                <tr className="text-white">
                  <th className="p-3 border">Date</th>
                  <th className="p-3 border">Type</th>
                  <th className="p-3 border">Amount</th>
                  <th className="p-3 border">Status</th>
                </tr>
              </thead>
              <tbody>
                {currentTransactions.length > 0 ? (
                  currentTransactions.map((transaction) => (
                    <tr key={transaction._id} className="hover:bg-gray-100">
                      <td className="p-3 border">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className="p-3 border">{transaction.type}</td>
                      <td className="p-3 border">
                        ₦{transaction.amount.toLocaleString()}
                      </td>
                      <td className="p-3 border">{transaction.status}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center p-3">
                      No transactions found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-5 flex justify-between items-center">
            <button
              className={`px-4 py-2 rounded bg-[#3AD1F0] text-white ${
                currentPage === 1 && "opacity-50 cursor-not-allowed"
              }`}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            <span className="text-gray-700">
              Page {currentPage} of {totalPages}
            </span>

            <button
              className={`px-4 py-2 rounded bg-[#3AD1F0] text-white ${
                currentPage === totalPages && "opacity-50 cursor-not-allowed"
              }`}
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionLogs;
