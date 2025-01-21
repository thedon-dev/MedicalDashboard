import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import { FaX } from "react-icons/fa6";
import { url } from "../config";

const UserProfile = () => {
  const { id } = useParams();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [walletDetails, setWalletDetails] = useState(null);
  const [creditAmount, setCreditAmount] = useState("");
  const [debitAmount, setDebitAmount] = useState("");
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userType, setUserType] = useState(null);
  const [walletLoading, setWalletLoading] = useState(false);

  const determineUserType = () => {
    if (location.pathname.includes("patients")) return "patients";
    if (location.pathname.includes("doctors")) return "doctors";
    if (location.pathname.includes("pharmacies")) return "pharmacies";
    if (location.pathname.includes("laboratories")) return "laboratories";
    return null;
  };

  const [adminId, setAdminId] = useState("");

  useEffect(() => {
    const type = determineUserType();
    setUserType(type);
  }, [location.pathname]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchUser = async () => {
      if (!userType || !id) return;
      try {
        const response = await axios.get(`${url}/api/user/profile/${id}`);
        setUser(response.data.userProfile);
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userType, id]);

  const fetchWalletDetails = async () => {
    setWalletLoading(true);
    try {
      const response = await axios.get(`${url}/api/auth/wallet-balance/${id}`);
      setWalletDetails(response.data.walletBalance);
      console.log(response.data.walletBalance);
    } catch (error) {
      console.error("Error fetching wallet details:", error);
    } finally {
      setWalletLoading(false);
    }
  };

  const handleCreditWallet = async () => {
    try {
      await axios.post(`${url}/api/wallet/credit`, {
        userId: id,
        amount: creditAmount,
      });
      alert("Wallet credited successfully!");
      fetchWalletDetails();
      setCreditAmount("");
    } catch (error) {
      console.error("Error crediting wallet:", error);
      alert("Failed to credit wallet.");
    }
  };

  const handleDebitWallet = async () => {
    try {
      await axios.post(`${url}/api/wallet/debit`, {
        userId: id,
        amount: debitAmount,
      });
      alert("Wallet debited successfully!");
      fetchWalletDetails();
      setDebitAmount("");
    } catch (error) {
      console.error("Error debiting wallet:", error);
      alert("Failed to debit wallet.");
    }
  };

  const fetchDocuments = async (id) => {
    try {
      const response = await axios.get(`${url}/documents/${id}`);
      setDocuments(response.data.documentsSubmitted);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const suspendUser = async (userId) => {
    try {
      const response = await axios.post(
        `${url}/api/admin/${adminId}/suspend-user`,
        {
          userId: userId,
        }
      );

      if (response.status === 200) {
        alert("User status updated successfully!");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("An error occurred while updating the user status.");
    }
  };

  const [suspendedUsers, setSuspendedUsers] = useState([]);
  const [userSuspended, setUserSuspended] = useState(false);
  const fetchSuspendedUsers = async () => {
    try {
      const response = await axios.get(`${url}/api/admin/suspended-accounts`);
      const suspendedIds = response.data.data.map((user) => user._id);
      setSuspendedUsers(suspendedIds);
    } catch (error) {
      console.error("Error fetching suspended users:", error);
    }
  };

  useEffect(() => {
    setUserSuspended(suspendedUsers.includes(id));
  }, [suspendedUsers, id]);

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const user = JSON.parse(storedUserData);
      setAdminId(user.id);
    }
    fetchSuspendedUsers();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  if (!user) return <p className="text-center mt-10">User not found</p>;

  return (
    <div className="p-5">
      <div className="rounded-lg overflow-hidden shadow-md">
        <div className="bg-blue-500 h-32"></div>
        <div className="relative bg-gray-100 px-5 pb-5 pt-10 rounded-b-lg">
          <button
            className="absolute -top-12 md:top-5 right-5 bg-green-600 text-white px-4 py-2 rounded-lg font-semibold z-20"
            onClick={() => {
              setWalletModalOpen(true);
              fetchWalletDetails();
            }}
          >
            Manage Wallet
          </button>
          <div className="relative">
            <div className="absolute top-[-75px] left-5">
              <img
                src={user.profilePhoto}
                alt={`${user.firstName} ${user.lastName}`}
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
            </div>
            <div className="ml-40">
              <h1 className="text-2xl font-bold">
                {user.firstName} {user.lastName}
              </h1>
              <p className="text-gray-600">{user.role}</p>
            </div>
          </div>

          <div className="mt-5">
            <h2 className="text-lg font-semibold">Details</h2>
            <ul className="mt-3 space-y-2">
              <li>Email: {user.email}</li>
              <li>Phone: {user.phone || "Not Provided"}</li>
              <li>Gender: {user.gender || "Not Provided"}</li>
              <li>
                Country: {user.country || "Not Provided"}, State:{" "}
                {user.state || "Not Provided"}
              </li>
              <li>Email Verified: {user.emailVerification ? "Yes" : "No"}</li>
              <li>
                KYC Status:{" "}
                {user.kycVerificationStatus ? "Verified" : "Not Verified"}
              </li>
            </ul>

            {userType === "doctor" && user.medicalSpecialty && (
              <div className="mt-5">
                <h2 className="text-lg font-semibold">Specialty</h2>
                <p>{user.medicalSpecialty.name}</p>
                <p>Consultation Fee: ${user.medicalSpecialty.fee}</p>
              </div>
            )}

            {userType === "pharmacy" && user.pharmacyDetails && (
              <div className="mt-5">
                <h2 className="text-lg font-semibold">Pharmacy Details</h2>
                <p>Name: {user.pharmacyDetails.name}</p>
              </div>
            )}

            {userType === "laboratory" && user.laboratoryDetails && (
              <div className="mt-5">
                <h2 className="text-lg font-semibold">Laboratory Details</h2>
                <p>Name: {user.laboratoryDetails.name}</p>
              </div>
            )}
          </div>

          <div className="mt-8 flex gap-5">
            <button
              onClick={() => suspendUser(id)}
              className={`${
                userSuspended ? "bg-green-600" : "bg-red-600"
              } text-white px-5 py-2 rounded-lg`}
            >
              {userSuspended ? "Unsuspend User" : "Suspend User"}
            </button>
            <button
              onClick={() => {
                fetchDocuments(id);
                setShowModal(true);
              }}
              className="bg-yellow-600 text-white px-5 py-2 rounded-lg"
            >
              Documents
            </button>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-[80%] lg:w-[500px] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">User Documents</h2>
              <button
                className="text-red-600 text-lg font-bold"
                onClick={() => setShowModal(false)}
              >
                <FaX size={20} />
              </button>
            </div>
            {documents.length > 0 ? (
              <ul>
                {documents.map((doc, index) => (
                  <li key={index} className="mb-4 border-b pb-2">
                    <p className="font-semibold">{doc.name}</p>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      View Document
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No documents available for this user.</p>
            )}
          </div>
        </div>
      )}
      {walletModalOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg w-[90%] lg:w-[500px] max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Manage Wallet</h2>
              <button
                className="text-red-600 text-lg font-bold"
                onClick={() => setWalletModalOpen(false)}
              >
                <FaX size={20} />
              </button>
            </div>
            {walletLoading ? (
              <p>Loading wallet details...</p>
            ) : walletDetails ? (
              <div>
                <p className="text-lg font-semibold">
                  Wallet Balance: ₦{walletDetails}
                </p>
                <div className="mt-5">
                  <div className="mb-3">
                    <label className="block font-semibold mb-2">
                      Credit Wallet:
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        value={creditAmount}
                        onChange={(e) => setCreditAmount(e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full"
                        placeholder="Enter amount to credit"
                      />
                      <button
                        onClick={handleCreditWallet}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg font-semibold"
                      >
                        Credit
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block font-semibold mb-2">
                      Debit Wallet:
                    </label>
                    <div className="flex gap-3">
                      <input
                        type="number"
                        value={debitAmount}
                        onChange={(e) => setDebitAmount(e.target.value)}
                        className="border border-gray-300 rounded p-2 w-full"
                        placeholder="Enter amount to debit"
                      />
                      <button
                        onClick={handleDebitWallet}
                        className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold"
                      >
                        Debit
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <p>Failed to fetch wallet details.</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
