import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaAngleLeft, FaAngleRight, FaRegStar, FaStar } from "react-icons/fa";
import user from "../assets/patient.png";
import TotalRequests from "../components/UserManagementComponents/TotalRequest";

const UserManagement = () => {
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);
  const [showData, setShowData] = useState("patients");
  const navigate = useNavigate();
  const liveUrl = "https://meddatabase.onrender.com";
  const localUrl = "http://localhost:3000";

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${liveUrl}/${showData}`);
        showData == "patients"
          ? setPatients(response.data)
          : setDoctors(response.data);
        console.log(showData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [showData]);

  const handleSuspend = async (userId) => {
    try {
      await axios.patch(`${liveUrl}/users/${userId}`, {
        suspended: true,
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, suspended: true } : user
        )
      );

      alert("User account suspended successfully!");
    } catch (error) {
      console.error("Error suspending user:", error);
    }
  };

  const totalPages = Math.ceil(patients.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = patients.slice(indexOfFirstRecord, indexOfLastRecord);

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  if (loading) {
    return <p className="text-center text-lg">Loading users...</p>;
  }

  return (
    <div className="p-4">
      <div className="flex gap-3 mb-10">
        {["patients", "doctors", "pharmarcy"].map((data, index) => (
          <button
            key={index}
            className={`px-4 py-3 ${
              showData == data ? "bg-[#3AD1F0]" : "bg-slate-500"
            } font-semibold text-white rounded shadow-lg hover:shadow-2xl `}
            onClick={() => setShowData(data)}
          >
            {data}
          </button>
        ))}
      </div>
      <div className="rounded-lg shadow-lg overflow-hidden">
        {/* {showData == "Doctors" ? (
          <table className="min-w-full bg-white rounded-lg">
            <thead>
              <tr className="bg-black text-white">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Purpose</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {doctors.map((user) => (
                <tr
                  key={user.id}
                  className="border-b hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleRowClick(user.id)}
                >
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4 capitalize">{user.tag}</td>
                  <td className="py-3 px-4">
                    {user.suspended ? (
                      <span className="text-red-500 font-semibold">
                        Suspended
                      </span>
                    ) : (
                      <span className="text-green-500 font-semibold">
                        Active
                      </span>
                    )}
                  </td>
                  <td
                    className="py-3 px-4 text-center"
                    onClick={(e) => e.stopPropagation()} // Prevent row click
                  >
                    {!user.suspended && (
                      <button
                        onClick={() => handleRowClick(user.id)}
                        className="bg-red-500 text-white py-1 px-3 rounded hover:bg-red-600"
                      >
                        Show Profile
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <table className="min-w-full bg-white rounded-lg">
            <thead>
              <tr className="bg-black text-white">
                <th className="py-3 px-4 text-left">Name</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {patients.map((user) => (
                <tr
                  key={user.id}
                  className="border-b hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleRowClick(user.id)}
                >
                  <td className="py-3 px-4">{user.name}</td>
                  <td className="py-3 px-4">{user.email}</td>
                  <td className="py-3 px-4">
                    {user.treatment ? (
                      <span className="text-red-500 font-semibold">
                        In Treatment
                      </span>
                    ) : (
                      <span className="text-gray-500 font-semibold">
                        Dormant
                      </span>
                    )}
                  </td>
                  <td
                    className="py-3 px-4 text-center"
                    onClick={(e) => e.stopPropagation()} // Prevent row click
                  >
                    <button
                      onClick={() => handleRowClick(user.id)}
                      className="bg-green-500 text-white py-1 px-3 rounded hover:bg-red-600"
                    >
                      Show Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )} */}
      </div>

      <div>
        {showData == "patients" ? (
          <div className="grid lg:grid-cols-3 gap-5">
            {currentRecords.map((patient, index) => (
              <div
                key={index}
                className="bg-white overflow-hidden lg:grid lg:grid-cols-5 rounded-lg shadow"
              >
                <div
                  className="overflow-hidden w-full h-full col-span-2"
                  style={{
                    backgroundImage: `url(${user})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                ></div>
                <div className="col-span-3 p-4 flex flex-col gap-1 justify-between w-full">
                  <h4 className="text-xl font-semibold">{patient.name}</h4>
                  <span className="">location: {patient.location}</span>
                  <div className="flex gap-2">
                    <span>Height: {patient.height}ft</span>
                    <span>Weight: {patient.weight}kg</span>
                  </div>
                  <Link
                    to={`/usermanagement/patients/${patient.id}`}
                    className="text-white text-center w-full py-2 rounded bg-[#3AD1F0] mt-2 font-semibold"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-5">
            {doctors.map((doctor, index) => (
              <div
                key={index}
                className="bg-white lg:grid grid-cols-5 rounded-lg shadow"
              >
                <div
                  className="overflow-hidden w-full h-full col-span-2"
                  style={{
                    backgroundImage: `url(${user})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  {/* <img src={user} alt="" className="object-cover"/> */}
                </div>
                <div className="col-span-3 p-4 flex flex-col gap-2 justify-between w-full">
                  <h4 className="text-xl font-semibold">{doctor.name}</h4>
                  <div className="flex items-center gap-2">
                    <p className="text-nowrap">Average Rating: </p>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }, (_, index) => (
                        <span key={index} className="flex">
                          {index < doctor.details.rating ? (
                            <FaStar className="text-green-500" size={15} />
                          ) : (
                            <FaRegStar className="text-gray-400" size={15} />
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                  <Link
                    to={`/usermanagement/doctors/${doctor.id}`}
                    className="w-full text-center py-2 rounded text-white bg-[#3AD1F0] mt-2 font-semibold"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
        {showData === "pharmarcy" && currentRecords > 0 && (
          <div>
            {doctors.map((doctor, index) => (
              <div
                key={index}
                className="bg-white lg:grid grid-cols-5 rounded-lg shadow"
              >
                <div
                  className="overflow-hidden w-full h-[300px] col-span-2"
                  style={{
                    backgroundImage: `url(${user})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                >
                  {/* <img src={user} alt="" className="object-cover"/> */}
                </div>
                <div className="col-span-3 p-4 flex flex-col gap-2 justify-between w-full">
                  <h4 className="text-xl font-semibold">{doctor.name}</h4>
                  <div className="flex items-center gap-2">
                    <p>Average Rating: </p>
                    {Array.from({ length: 5 }, (_, index) => (
                      <span key={index} className="flex">
                        {index < doctor.details.rating ? (
                          <FaStar className="text-green-500" size={15} />
                        ) : (
                          <FaRegStar className="text-gray-400" size={15} />
                        )}
                      </span>
                    ))}
                  </div>

                  <p className="">{doctor.details.bio}</p>
                  <Link
                    to={`/usermanagement/doctors/${doctor.id}`}
                    className="w-full text-center py-2 rounded text-white bg-[#3AD1F0] mt-2 font-semibold"
                  >
                    View Profile
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex items-center gap-4 justify-center mt-10">
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
  );
};

export default UserManagement;
