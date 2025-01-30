import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminProfilePage = ({ selectedUserId }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [walletAmount, setWalletAmount] = useState("");
  const [suspensionReason, setSuspensionReason] = useState("");

  useEffect(() => {
    console.log("Selecteduser id: ", selectedUserId)
    if (selectedUserId) {
      fetchUserDetails(selectedUserId);
    }
  }, [selectedUserId]);

  const fetchUserDetails = async (userId) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `https://backend-code-8vf0.onrender.com/users/${userId}`
      );
      setUserDetails(response.data);
    } catch (err) {
      setError("Failed to fetch user details.");
    } finally {
      setIsLoading(false);
    }
  };

  const updateWallet = async (amount) => {
    if (!amount) return;
    try {
      const newBalance = userDetails.walletBalance + Number(amount);
      await axios.patch(`http://localhost:3000/users/${userDetails.id}`, {
        walletBalance: newBalance,
      });
      setUserDetails((prev) => ({
        ...prev,
        walletBalance: newBalance,
      }));
      setWalletAmount("");
      alert("Wallet updated successfully!");
    } catch (err) {
      alert("Failed to update wallet balance.");
    }
  };

  const suspendUser = async () => {
    if (!suspensionReason) {
      alert("Please provide a reason for suspension.");
      return;
    }
    try {
      await axios.patch(`http://localhost:3000/users/${userDetails.id}`, {
        status: "Suspended",
        suspensionReason,
      });
      setUserDetails((prev) => ({
        ...prev,
        status: "Suspended",
        suspensionReason,
      }));
      alert("User suspended successfully.");
    } catch (err) {
      alert("Failed to suspend user.");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-8">
      {userDetails ? (
        <>
          {/* User Info Section */}
          <div className="mb-6 bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">User Details</h2>
            <p><strong>Name:</strong> {userDetails.name}</p>
            <p><strong>User Type:</strong> {userDetails.userType}</p>
            <p><strong>Status:</strong> {userDetails.status || "Active"}</p>
            {userDetails.suspensionReason && (
              <p className="text-red-500">
                <strong>Suspension Reason:</strong> {userDetails.suspensionReason}
              </p>
            )}
            <p><strong>Wallet Balance:</strong> ₦{userDetails.walletBalance}</p>
          </div>

          {/* Wallet Management Section */}
          <div className="mb-6 bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Manage Wallet</h2>
            <div className="flex gap-4">
              <input
                type="number"
                className="border border-gray-300 rounded-lg p-2 w-full"
                placeholder="Enter amount (e.g. 1000)"
                value={walletAmount}
                onChange={(e) => setWalletAmount(e.target.value)}
              />
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-lg"
                onClick={() => updateWallet(walletAmount)}
              >
                Update Wallet
              </button>
            </div>
          </div>

          {/* Suspension Section */}
          <div className="mb-6 bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Suspend User</h2>
            <textarea
              className="border border-gray-300 rounded-lg p-2 w-full"
              placeholder="State the reason for suspension..."
              value={suspensionReason}
              onChange={(e) => setSuspensionReason(e.target.value)}
            />
            <button
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg"
              onClick={suspendUser}
            >
              Suspend User
            </button>
          </div>

          {/* User Documents Section */}
          <div className="mb-6 bg-white shadow-md p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4">Submitted Documents</h2>
            {userDetails.documents && userDetails.documents.length > 0 ? (
              <ul className="list-disc pl-6">
                {userDetails.documents.map((doc, index) => (
                  <li key={index}>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {doc.name}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No documents submitted.</p>
            )}
          </div>
        </>
      ) : (
        <p>No user selected.</p>
      )}
    </div>
  );
  {/*Old repo */}
};

export default AdminProfilePage;
