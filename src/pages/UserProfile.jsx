import React, { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axios from "axios";
import img from "../assets/patient.png";
import { BsDot } from "react-icons/bs";
import WalletManagement from "../components/UserProfile/WalletManagement";
import { FaX } from "react-icons/fa6";
import { url } from "../config";

const UserProfile = () => {
  const { id } = useParams();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [userType, setUserType] = useState(null);
  const localUrl = "http://localhost:3000";
  const liveUrl = "https://meddatabase-1.onrender.com";


  const isPatient = location.pathname.includes("patients");
  const isDoctor = location.pathname.includes("doctors");

  useEffect(() => {
    if (location.pathname.includes("patient")) {
      setUserType("patients");
    } else if (location.pathname.includes("doctor")) {
      setUserType("doctors");
    } else if (location.pathname.includes("pharmacy")) {
      setUserType("pharmacy");
    } else if (location.pathname.includes("laboratory")) {
      setUserType("laboratory");
    }
  }, [location.pathname]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!userType || !id) return;
      try {
        const response = await axios.get(`${url}/api/user/profile/${id}`);
        setUser(response.data);
        console.log(response.data)
      } catch (error) {
        console.error("Error fetching user:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userType, id]);

  const fetchDocuments = async (id) => {
    try {
      const response = await axios.get(
        `${url}/documents/${id}`
      );
      setDocuments(response.data.documentsSubmitted);
    } catch (error) {
      console.error("Error fetching documents:", error);
    }
  };

  const suspendUser = async (userId) => {
    try {
      const response = await axios.patch(`${liveUrl}/${userType}/${userId}`, {
        suspended: !user.suspended,
      });
      setUser((prev) => ({ ...prev, suspended: !prev.suspended }));

      if (response.status === 200) {
        alert(
          user.suspended
            ? "User unsuspended successfully!"
            : "User suspended successfully!"
        );
      } else {
        throw new Error("Failed to update user status.");
      }
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("An error occurred while updating the user status.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>User not found</p>;

  return (
    <div className="">
      <div className="">
        <div className="">
          {isPatient && <p className="text-2xl font-bold">Patient's Profile</p>}
          {isDoctor && <p className="text-2xl font-bold">Doctor's Profile</p>}
        </div>
      </div>
      <div className="mt-5 rounded-t-lg bg-blue-400 h-[20vh]"></div>
      <div className="bg-gray-100 rounded-b-lg pb-10">
        <div className="px-[5%] lg:px-[10%] flex flex-col lg:flex-row flex-wrap">
          <div className="relative flex gap-5 lg:gap-8 h-fit pb-5 pt-3">
            <div className="-top-20 absolute w-[150px] h-[150px] lg:w-[200px] lg:h-[200px] rounded-full overflow-hidden">
              <img src={user.userProfile.profilePhoto} alt="" />
            </div>
            <div className="ms-[170px] lg:ms-[250px]">
            <span className="font-semibold text-sm">{user.userProfile.role}</span>
              <h1 className="text-3xl lg:text-2xl font-semibold">{user.userProfile.firstName} {user.userProfile.lastName}</h1>
              <span className="text-lg">{user.userProfile.gender}</span>
            </div>
          </div>

          <div className="lg:ms-auto flex h-fit text-xs lg:text-base lg:flex-row gap-5 text-white mt-5">
            <button
              className="bg-red-700 p-3 rounded font-semibold text-nowrap"
              onClick={() => suspendUser(id)}
            >
              {!user.suspended ? "Suspend User" : "Unsuspend User"}
            </button>
            <button
              className="bg-yellow-600 p-3 rounded font-semibold text-nowrap"
              onClick={() => {
                fetchDocuments(id);
                setShowModal(true);
              }}
            >
              Documents
            </button>
            <button
              onClick={() => setWalletModalOpen(!walletModalOpen)}
              className="bg-green-700 p-3 rounded font-semibold text-nowrap"
            >
              Manage Wallet
            </button>
          </div>
        </div>
        <div className="px-[5%] lg:px-[10%] mt-8">
          <div className="">
            <div className="px-4 font-semibold border-b-2 border-black w-fit">
              Bio
            </div>
            <div className="mt-5">
              <p className="text-black text-base">{user.userProfile.about}</p>
            </div>
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
                <FaX size={20}/>
              </button>
            </div>
            {documents.length > 0 ? (
              <ul>
                {documents.map((doc, index) => (
                  <li key={index} className="mb-4 border-b pb-2">
                    <p className="font-semibold">{doc.name}</p>
                    <p className="text-sm text-gray-600">
                      Submitted:{" "}
                      {/* {new Date(doc.submittedAt).toLocaleDateString()} */}
                    </p>
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
        <WalletManagement
          setWalletModalOpen={() => setWalletModalOpen(false)}
          id={id}
        />
      )}
    </div>
  );
};

export default UserProfile;
