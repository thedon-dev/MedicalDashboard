import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaAngleLeft, FaAngleRight, FaRegStar, FaStar } from "react-icons/fa";
import user from "../assets/patient.png";
import TotalRequests from "../components/UserManagementComponents/TotalRequest";
import { url } from "../config";
import { BiSearch } from "react-icons/bi";

const UserManagement = () => {
  const [data, setData] = useState({
    patients: [],
    doctors: [],
    laboratories: [],
    pharmacies: [],
  });

  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(5);
  const [showData, setShowData] = useState("doctors");

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);

    const APIurl = {
      patients: "api/admin/patients",
      doctors: "api/provider/all-doctors",
      pharmacies: "api/admin/pharmacies",
      laboratories: "api/admin/laboratories",
    }[showData];

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${url}/${APIurl}`);

        switch (showData) {
          case "patients":
            setData((prevState) => ({
              ...prevState,
              patients: response.data.patients,
            }));
            break;
          case "doctors":
            setData((prevState) => ({
              ...prevState,
              doctors: response.data.doctors,
            }));
            break;
          case "laboratories":
            setData((prevState) => ({
              ...prevState,
              laboratories: response.data,
            }));
            break;
          case "pharmacies":
            setData((prevState) => ({
              ...prevState,
              pharmacies: response.data,
            }));
            break;
          default:
            console.warn("Invalid value for showData:", showData);
        }

        console.log("data: ", data[showData]);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [showData]);

  const totalPages = Math.ceil(data?.[showData]?.length / recordsPerPage);
  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords =
    data?.[showData]?.slice(indexOfFirstRecord, indexOfLastRecord) || [];

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
    <div className="">
      <div className="flex gap-3 mb-10">
        {[
          "doctors",
          "patients",
          "pharmacies",
          "laboratories",
          "therapists",
        ].map((data, index) => (
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
      <div className="my-4 w-full">
        <div className="flex items-center gap-1 py-1 px-4 border rounded-lg">
          <BiSearch size={23} />
          <input
            type="text"
            placeholder={`Search ${showData}`}
            // value={searchTerm}
            // onChange={(e) => setSearchTerm(e.target.value)}
            className="p-2 w-full md:w-1/3 capitalize focus:outline-none"
          />
        </div>
      </div>

      <div>
        {showData === "patients" && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {currentRecords.length > 0 ? (
              currentRecords.map((patient, index) => (
                <div
                  key={index}
                  className="bg-white w-full rounded-lg shadow-md border p-4 flex flex-col justify-between hover:shadow-lg transition-shadow"
                >
                  {/* Patient Details */}
                  <div className="flex flex-col gap-2">
                    <h4 className="text-lg font-semibold text-gray-800 truncate">
                      {patient.firstName} {patient.lastName}
                    </h4>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Location:</span>{" "}
                      {patient.address
                        ? patient.address
                        : "No address provided"}
                    </p>
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Gender:</span>{" "}
                      {patient.gender ? patient.gender : "Not specified"}
                    </p>
                  </div>

                  {/* Profile Link */}
                  <div className="mt-4">
                    <Link
                      to={`/admin/usermanagement/patients/${patient.id}`}
                      className="block text-center py-2 rounded bg-[#3AD1F0] text-white font-semibold hover:bg-[#33bce5] transition"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                No patients found.
              </p>
            )}
          </div>
        )}

        {showData === "doctors" && (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {currentRecords.length > 0 ? (
              currentRecords.map((doctor, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md border p-4 flex flex-col justify-between hover:shadow-lg transition-shadow"
                >
                  {/* Doctor Details */}
                  <div className="flex flex-col gap-3">
                    <h4 className="text-lg font-semibold text-gray-800 truncate">
                      Dr. {doctor.fullName}
                    </h4>

                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Gender:</span>{" "}
                      {doctor.gender}
                    </p>

                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Active Status:</span>{" "}
                      <span
                        className={`font-semibold ${
                          doctor.isOnline ? "text-green-500" : "text-red-600"
                        }`}
                      >
                        {doctor.isOnline === true ? "Online" : "Offline"}
                      </span>
                    </p>

                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Medical Specialty:</span>{" "}
                      {doctor.medicalSpecialty.name}
                    </p>
                  </div>

                  {/* Profile Link */}
                  <div className="mt-4">
                    <Link
                      to={`/admin/usermanagement/doctors/${doctor._id}`}
                      className="block text-center py-2 rounded bg-[#3AD1F0] text-white font-semibold hover:bg-[#33bce5] transition"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                No doctors found.
              </p>
            )}
          </div>
        )}

        {showData === "pharmacies" && (
          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {currentRecords.length > 0 ? (
              currentRecords.map((pharmacy, index) => (
                <div
                  key={index}
                  className="bg-white rounded-lg shadow-md border p-4 flex flex-col justify-between hover:shadow-lg transition-shadow"
                >
                  {/* Pharmacy Details */}
                  <div className="flex flex-col gap-3">
                    <h4 className="text-lg font-semibold text-gray-800 truncate">
                      {pharmacy.name}
                    </h4>

                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Address:</span>{" "}
                      {pharmacy.address
                        ? pharmacy.address
                        : "No address provided"}
                    </p>

                    <p
                      className={`text-sm font-semibold ${
                        pharmacy.kycVerification
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {pharmacy.kycVerification === true
                        ? "KYC Verified"
                        : "KYC Not Verified"}
                    </p>
                  </div>

                  {/* Profile Link */}
                  <div className="mt-4">
                    <Link
                      to={`/admin/usermanagement/pharmacies/${pharmacy._id}`}
                      className="block text-center py-2 rounded bg-[#3AD1F0] text-white font-semibold hover:bg-[#33bce5] transition"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center col-span-full">
                No pharmacies found.
              </p>
            )}
          </div>
        )}

        {showData === "laboratories" && (
          <div className="flex flex-wrap gap-5">
            {currentRecords.length > 0 &&
              currentRecords.map((lab, index) => (
                <div
                  key={index}
                  className={` overflow-hidden bg-white md:w-[20rem] lg:grid grid-cols-5 rounded-lg shadow`}
                >
                  {/* <div
                  className="overflow-hidden w-full h-full col-span-2"
                  style={{
                    backgroundImage: `url(${doctor.images.profilePhoto})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    backgroundRepeat: "no-repeat",
                  }}
                ></div> */}
                  <div className="col-span-3 p-4 flex flex-col gap-2 justify-between w-full">
                    <h4 className="text-xl font-semibold">{lab.name}</h4>
                    {/* <span className="text-sm">Address: {lab.address}</span> */}
                    <div className="">
                      <p className="text-nowrap">
                        Active Status:{" "}
                        <span
                          className={`${
                            lab.isOnline === true
                              ? "text-green-500"
                              : "text-red-600"
                          } `}
                        >
                          {lab.isOnline === true ? "Online" : "Offline"}
                        </span>{" "}
                      </p>
                      <div className="mt-1">
                        <span className="text-sm">Address: {lab.address}</span>
                      </div>
                      <p
                        className={`text-sm font-semibold ${
                          lab.kycVerification
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {lab.kycVerification === true
                          ? "KYC Verified"
                          : "KYC Not Verified"}
                      </p>
                    </div>
                    <Link
                      to={`/admin/usermanagement/laboratories/${lab._id}`}
                      className="w-full text-center py-2 rounded text-white bg-[#3AD1F0] mt-2 font-semibold"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        )}

        {showData === "therapist" && currentRecords > 0 && (
          <div>
            {currentRecords.length > 0 &&
              currentRecords.map((laboratory, index) => (
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
                    <h4 className="text-xl font-semibold">{laboratory.name}</h4>
                    {/* <div className="flex items-center gap-2">
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
                    </div> */}

                    <p className="">{laboratory.details.bio}</p>
                    <Link
                      to={`/usermanagement/therapists/${laboratory.id}`}
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
