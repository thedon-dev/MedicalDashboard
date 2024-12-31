import React, { useEffect, useState } from "react";
import PatientsData from "../components/DashboardComponents/PatientsData";
import CountUp from "react-countup";
import { GiDoctorFace } from "react-icons/gi";
import { FaUserDoctor } from "react-icons/fa6";
import { FaUserInjured } from "react-icons/fa";
import { MdFreeCancellation } from "react-icons/md";
import { CgCalendar } from "react-icons/cg";
import { url } from "../config";
import axios from "axios";

const Dashboard = () => {
  const [dataSet, setDataSet] = useState([
    {
      name: "Our Doctors",
      data: 0,
      color: "bg-pink-500",
      icon: <FaUserDoctor size={35} color="pink" />,
    },
    {
      name: "Our Patients",
      data: 0,
      color: "bg-blue-300",
      icon: <FaUserInjured size={35} color="blue" />,
    },
    {
      name: "Appointments",
      data: 0,
      color: "bg-yellow-600",
      icon: <CgCalendar size={35} color="yellow" />,
    },
    {
      name: "Cancelled",
      data: 0,
      color: "bg-red-300",
      icon: <MdFreeCancellation size={35} color="red" />,
    },
  ]);

  const localUrl = "http://localhost:3000";
  const liveurl = "https://meddatabase-1.onrender.com";

  useEffect(() => {
    window.scrollTo(0, 0);

    const fetchData = async () => {
      try {
        const response = await axios.get(`${url}/api/admin/statistics-cards`);
        const { totalDoctors, totalPatients, totalScheduled, totalCanceled } =
          response.data.data;
        console.log(response.data);

        const updatedDataSet = [
          { ...dataSet[0], data: totalDoctors }, // Total Doctors
          { ...dataSet[1], data: totalPatients }, // Total Patients
          { ...dataSet[2], data: totalScheduled }, // Total Appointments
          { ...dataSet[3], data: totalCanceled }, // Total Cancelled
        ];

        // Update the state
        setDataSet(updatedDataSet);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData()
  }, []);
  return (
    <div className="">
      <div>
        <h1 className="text-2xl font-bold">Welcome</h1>
        <div className="flex gap-5 flex-wrap mt-10">
          {dataSet.map((data, index) => (
            <div
              key={index}
              className="w-[15rem] shadow-lg rounded p-4 flex gap-3 items-center"
            >
              <div
                className={`p-2 rounded ${data.color} flex justify-center items-center`}
              >
                {data.icon}
              </div>
              <div className="">
                <h3 className="text-base lg:text-lg font-semibold">
                  {data.name}
                </h3>
                {/* <span className='text-xl font-bold'>{data.data}</span> */}
                <span className="text-xl lg:text-2xl font-bold">
                  <CountUp
                    start={0}
                    end={data.data}
                    duration={2}
                    separator=","
                  />
                </span>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <PatientsData />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
