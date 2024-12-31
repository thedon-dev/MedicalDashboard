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
    const APIurl = {
      patients: "api/admin/patients",
      doctors: "api/provider/all-doctors",
      pharmacies: "api/admin/pharmacies",
      laboratories: "api/admin/laboratories",
    }[showData];

    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${url}/${APIurl}`);
        showData === "patients"
          ? setData((prevState) => ({
              ...prevState,
              patients: response.data.patients,
            }))
          : showData === "doctors"
          ? setData((prevState) => ({
              ...prevState,
              doctors: response.data.doctors,
            }))
          : showData === "laboratories"
          ? setData((prevState) => ({
              ...prevState,
              laboratories: response.data.laboratories,
            }))
          : showData === "pharmacies"
          ? setData((prevState) => ({
              ...prevState,
              pharmacies: response.data.pharmacies,
            }))
          : null;

        console.log("data: ", data[showData]);
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
        {["doctors", "patients", "pharmarcies", "laboratories", "therapists"].map(
          (data, index) => (
            <button
              key={index}
              className={`px-4 py-3 ${
                showData == data ? "bg-[#3AD1F0]" : "bg-slate-500"
              } font-semibold text-white rounded shadow-lg hover:shadow-2xl `}
              onClick={() => setShowData(data)}
            >
              {data}
            </button>
          )
        )}
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
          <div className="grid md:flex flex-wrap gap-5">
            {currentRecords.length > 0 &&
              currentRecords.map((patient, index) => (
                <div
                  key={index}
                  className="bg-white w-[20rem] flex-shrink h-fit overflow-hidden lg:grid lg:grid-cols-5 rounded-lg shadow"
                >
                  <div
                    className="overflow-hidden w-full lg:h-full col-span-2"
                    style={{
                      backgroundImage: `url(${user})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                      backgroundRepeat: "no-repeat",
                    }}
                  ></div>
                  <div className="col-span-3 p-4 flex flex-col gap-1 justify-between w-full">
                    <h4 className="text-xl font-semibold">
                      {patient.firstName} {patient.lastName}
                    </h4>
                    <span className="">
                      location:{" "}
                      {patient.address ? patient.address : "no address given"}
                    </span>
                    <span>
                      gender:{" "}
                      {patient.gender ? patient.gender : "gender not given"}
                    </span>
                    <Link
                      to={`/admin/usermanagement/patients/${patient.id}`}
                      className="text-white text-center w-full py-2 rounded bg-[#3AD1F0] mt-2 font-semibold"
                    >
                      View Profile
                    </Link>
                  </div>
                </div>
              ))}
          </div>
        )}
        {showData === "doctors" && (
          <div className="flex flex-wrap gap-5">
            {currentRecords.length > 0 &&
              currentRecords.map((doctor, index) => (
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
                    <h4 className="text-xl font-semibold">
                      Dr. {doctor.fullName}
                    </h4>
                    <span className="text-sm">Gender: {doctor.gender}</span>
                    <div className="">
                      <p className="text-nowrap">
                        Active Status:{" "}
                        <span
                          className={`${
                            doctor.isOnline ? "text-green-500" : "text-red-600"
                          } `}
                        >
                          {doctor.isOnline ? "Online" : "Offline"}
                        </span>{" "}
                      </p>
                      <div className="mt-1">
                        <span className="">
                          Medical Specialty: {doctor.medicalSpecialty.name}
                        </span>
                      </div>
                    </div>
                    <Link
                      to={`/admin/usermanagement/doctors/${doctor._id}`}
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
            {currentRecords.length > 0 &&
              currentRecords.map((doctor, index) => (
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

        {showData === "laboratories" && currentRecords > 0 && (
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
                      to={`/usermanagement/doctors/${laboratory.id}`}
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
