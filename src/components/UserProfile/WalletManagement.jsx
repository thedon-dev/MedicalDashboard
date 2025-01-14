import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";
import { url } from "../../config";

const WalletManagement = ({ setWalletModalOpen, id }) => {
  const [transactionAmount, setTransactionAmount] = useState("");
  const [walletBalance, setWalletBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const localUrl = "http://localhost:3000";
  const liveUrl = "https://meddatabase.onrender.com";

  useEffect(() => {
    const fetchWalletBalance = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`${url}/api/auth/wallet-balance/${id}`);
        if (response.data.success) {
          setWalletBalance(response.data.walletBalance);
        } else {
          setError("Failed to fetch wallet balance.");
        }
      } catch (error) {
        console.error("Error fetching wallet balance:", error);
        setError("An error occurred while fetching wallet balance.");
      } finally {
        setLoading(false);
      }
    };

    fetchWalletBalance();
  }, [id]);

  const handleWalletTransaction = async (type) => {
    if (!transactionAmount || isNaN(transactionAmount) || parseFloat(transactionAmount) <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    try {
      let updatedBalance;
      if (type === "credit") {
        updatedBalance = walletBalance + parseFloat(transactionAmount);
      } else if (type === "debit") {
        if (parseFloat(transactionAmount) > walletBalance) {
          alert("Insufficient funds in the wallet.");
          return;
        }
        updatedBalance = walletBalance - parseFloat(transactionAmount);
      }

      const response = await axios.patch(`${liveUrl}/wallets/${id}/`, {
        amount: updatedBalance,
      });

      if (response.status === 200) {
        alert(
          type === "credit"
            ? "Funds credited successfully!"
            : "Funds deducted successfully!"
        );
        setWalletBalance(updatedBalance);
        setTransactionAmount("");
        setError("");
      } else {
        throw new Error("Failed to update wallet.");
      }
    } catch (error) {
      console.error("Error updating wallet:", error);
      alert("An error occurred while updating the wallet.");
    }
  };

  return (
    <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-[400px]">
        <h2 className="text-2xl font-bold text-center">Manage Wallet</h2>
        {loading ? (
          <div className="flex justify-center items-center h-[10rem]">
            <p className="text-gray-500">Loading...</p>
          </div>
        ) : error ? (
          <div className="text-red-500 text-center my-4">{error}</div>
        ) : (
          <div className="w-full h-[10rem] flex items-center justify-center bg-[#177588] text-white rounded-lg my-5">
            <h1 className="text-3xl font-bold">N{walletBalance}</h1>
          </div>
        )}

        <label className="block mb-2 font-semibold">Transaction Amount:</label>
        <input
          type="number"
          className="focus:outline-none w-full border border-gray-300 rounded p-2 mb-2"
          value={transactionAmount}
          onChange={(e) => setTransactionAmount(e.target.value)}
          placeholder="Enter amount"
        />

        {error && !loading && (
          <p className="text-red-500 mb-4 text-sm text-center">{error}</p>
        )}

        <div className="flex justify-between gap-4 mt-4">
          <button
            className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded font-semibold w-full justify-center"
            onClick={() => handleWalletTransaction("credit")}
            disabled={loading}
          >
            <FaPlus /> Credit Wallet
          </button>
          <button
            className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded font-semibold w-full justify-center"
            onClick={() => handleWalletTransaction("debit")}
            disabled={loading}
          >
            <FaMinus /> Deduct Wallet
          </button>
        </div>

        <button
          className="mt-4 text-gray-500 underline w-full text-center"
          onClick={setWalletModalOpen}
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default WalletManagement;
