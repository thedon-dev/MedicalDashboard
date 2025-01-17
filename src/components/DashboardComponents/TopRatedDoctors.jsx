import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { url } from "../../config";

const TopRatedDoctorsTable = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axios.get(
          `${url}/api/provider/top-rated-doctors`
        );
        setDoctors(response.data.data);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch doctors");
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  const handleRowClick = (doctorId) => {
    navigate(`/doctors/${doctorId}`);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Top Rated Doctors</h1>
      <div className="rounded-lg overflow-hidden overflow-x-scroll lg:overflow-x-hidden text-nowrap">
        <table className="w-full table-auto border-collapse border border-gray-300">
          <thead>
            <tr className="bg-[#3AD1F0] text-white">
              <th className="border border-gray-300 px-4 py-2">Name</th>
              <th className="border border-gray-300 px-4 py-2">Specialty</th>
              <th className="border border-gray-300 px-4 py-2">Gender</th>
              <th className="border border-gray-300 px-4 py-2">
                Average Rating
              </th>
              <th className="border border-gray-300 px-4 py-2">Address</th>
            </tr>
          </thead>
          <tbody>
            {doctors.map((doctor) => (
              <tr
                key={doctor._id}
                className="hover:bg-gray-200 cursor-pointer"
                onClick={() => handleRowClick(doctor._id)}
              >
                <td className="border border-gray-300 px-4 py-2">
                  {doctor.fullName}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {doctor.medicalSpecialty?.name || "Not Specified"}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {doctor.userDetails.gender}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {doctor.averageRating}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {doctor.address}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TopRatedDoctorsTable;
