import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa";

const WalletManagement = ({ setWalletModalOpen, id }) => {
  const [transactionAmount, setTransactionAmount] = useState("");
  const [walletAmount, setWalletAmount] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const localUrl = "http://localhost:3000";
  const liveUrl = "https://meddatabase.onrender.com";


  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      try {
        const response = await axios.get(`${liveUrl}/wallets/${id}`);
        setWalletAmount(response.data.amount);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, [id]);

  const handleWalletTransaction = async (type) => {
    if (!transactionAmount || isNaN(transactionAmount)) {
      setError(true);
      return;
    }
    try {
      let updatedBalance;
      if (type === "credit") {
        updatedBalance = walletAmount + parseFloat(transactionAmount);
      } else if (type === "debit") {
        if (parseFloat(transactionAmount) > walletAmount) {
          alert("Insufficient funds in the wallet.");
          setWalletModalOpen()
          return;
        }
        updatedBalance = walletAmount - parseFloat(transactionAmount);
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
        setError(false);
        setWalletModalOpen();
        setTransactionAmount("");
      } else {
        throw new Error("Failed to update wallet.");
      }
    } catch (error) {
      console.error("Error updating wallet:", error);
      alert("An error occurred while updating the wallet.");
    } finally {
      setError(false);
    }
  };

  return (
    <div className="">
      <div className="border border-red-500 fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded shadow-lg w-[400px]">
          <h2 className="text-xl font-bold">Manage Wallet</h2>
          <div className="w-full h-[10rem] grid place-content-center text-white bg-[#177588] rounded-lg my-5">
            <h1 className="text-3xl font-bold">
              N{walletAmount ? walletAmount : "0"}
            </h1>
          </div>
          <label className="block mb-2 font-semibold">Amount:</label>
          <input
            type="number"
            className="focus:outline-none w-full border border-gray-300 rounded p-2 "
            value={transactionAmount}
            onChange={(e) => setTransactionAmount(e.target.value)}
            placeholder="Enter amount"
          />
          {error && (
            <p className="text-red-500 mb-4 text-sm">
              Please Enter A Valid Amount
            </p>
          )}
          <div className="flex justify-between gap-4 mt-4">
            <button
              className="flex items-center gap-1 bg-blue-500 text-white px-3 py-2 rounded font-semibold"
              onClick={() => handleWalletTransaction("credit")}
            >
              <FaPlus /> Credit Wallet
            </button>
            <button
              className="flex items-center gap-1 bg-red-500 text-white px-3 py-2 rounded font-semibold"
              onClick={() => handleWalletTransaction("debit")}
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
    </div>
  );
};

export default WalletManagement;
