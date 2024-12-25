import React, { useEffect, useState } from "react";
import { PiPencil } from "react-icons/pi";
import ProfilePicture from "../assets/profile.png";
import axios from "axios";

const ProfilePage = () => {
  const [data, setData] = useState({
    companyName: "",
    registrationNumber: "",
    phoneNumber: "",
    email: "",
  });
  const [editDetails, setEditDetails] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const response = axios.get();
    };
  }, []);
  return (
    <div className="">
      <div className="lg:w-[60%] mx-auto mt-20">
        <div className="flex justify-between">
          <div className="w-12 h-12 rounded-full">
            <img src={ProfilePicture} alt="" className="object-cover" />
          </div>
          <button
            onClick={() => setEditDetails(true)}
            className="text-red-500 flex gap-3 items-center"
          >
            <PiPencil />
            edit
          </button>
        </div>
        <form
          action=""
          className="lg:grid lg:grid-cols-2 gap-5 lg:gap-10 w-full mt-10"
        >
          <div className="flex flex-col mt-5 lg:mt-0">
            <label>Company Name</label>
            <input
              disabled={!editDetails}
              type="text"
              name="companyName"
              id=""
              placeholder=""
              className="border border-slate-200 rounded p-3 mt-2"
            />
          </div>
          <div className="flex flex-col mt-5 lg:mt-0">
            <label>Registration Number</label>
            <input
              disabled={true}
              type="text"
              name="registrationNumber"
              id=""
              placeholder=""
              className="border border-slate-200 rounded p-3 mt-2"
            />
          </div>
          <div className="flex flex-col mt-5 lg:mt-0">
            <label>Phone Number</label>
            <input
              disabled={!editDetails}
              type="number"
              name="phoneNumber"
              id=""
              placeholder=""
              className="border border-slate-200 rounded p-3 mt-2"
            />
          </div>
          <div className="flex flex-col mt-5 lg:mt-0">
            <label>Email</label>
            <input
              disabled={!editDetails}
              type="email"
              name="email"
              id=""
              placeholder=""
              className="border border-slate-200 rounded p-3 mt-2"
            />
          </div>
          <div className="col-span-2 flex justify-end mt-5 lg:mt-0">
            <button className="bg-red-700 text-white rounded px-5 py-2">
              Change Password
            </button>
          </div>
          <div className="flex mt-5 lg:mt-0">
            <button className="bg-[#3AD1F0] text-black font-semibold rounded px-10 py-3">
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfilePage;
