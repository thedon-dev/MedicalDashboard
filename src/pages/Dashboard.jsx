import React, { useEffect } from "react";
import PatientsData from "../components/DashboardComponents/PatientsData";
import CountUp from "react-countup";
import { GiDoctorFace } from "react-icons/gi";
import { FaUserDoctor } from "react-icons/fa6";
import { FaUserInjured } from "react-icons/fa";
import { MdFreeCancellation } from "react-icons/md";
import { CgCalendar } from "react-icons/cg";

const Dashboard = () => {
  const dataSet = [
    {
      name: "Our Doctors",
      data: 140,
      color: "bg-pink-500",
      icon: <FaUserDoctor size={35} color="pink" />,
    },
    {
      name: "Our Patients",
      data: 232,
      color: "bg-blue-300",
      icon: <FaUserInjured size={35} color="blue" />,
    },
    {
      name: "Appointments",
      data: 20,
      color: "bg-yellow-600",
      icon: <CgCalendar size={35} color="yellow" />,
    },
    {
      name: "Cancelled",
      data: 84,
      color: "bg-red-300",
      icon: <MdFreeCancellation size={35} color="red" />,
    },
  ];
  const localUrl = "http://localhost:3000"
  const liveurl = "https://meddatabase-1.onrender.com"

  useEffect(()=> {
    window.scrollTo(0, 0);

    const fetchData = async ()=> {
      try {
        const doctorData = await axios.get(`${localUrl}/doctors`)
        console.log(doctorData)
      } catch (error) {
        
      }
    }
      

  }, [])
  return (
    <div className="">
      <div>
        <h1 className="text-2xl font-bold">Welcome</h1>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-10 mt-10">
          {dataSet.map((data, index) => (
            <div key={index} className="shadow-lg rounded p-4 flex gap-3 items-center">
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

        {/* <div className="mt-10 grid lg:grid-cols-5">
          <div className="col-span-3">
            <h3 className="text-2xl font-bold">Recent Patient Activity</h3>
            <div className="py-2 px-3 rounded shadow-lg mt-5 items-center">
              <div className="flex justify-between items-end">
                <div
                  className="w-16 h-16 overflow-hidden rounded"
                  style={{
                    backgroundImage: `url(https://res.cloudinary.com/dcyhpvejn/image/upload/v1728381866/samples/smile.jpg)`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                />

                <div className="">
                  <h3 className="font-semibold">Prince Ezeonu</h3>
                  <p className="text-sm">3 waterlines, Port-harcourt</p>
                </div>
                <p className="text-sm font-semibold">Insomnia</p>
                <span className="text-sm font-semibold">In Treatment</span>
                <p className="text-sm font-semibold">New Patient</p>
              </div>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default Dashboard;
