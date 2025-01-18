import React, { useEffect, useState } from "react";
import { BsMenuButton, BsPeople } from "react-icons/bs";
import { FaAngleDown, FaBars, FaMoneyBill, FaSignOutAlt } from "react-icons/fa";
import {
  Link,
  NavLink,
  Outlet,
  useLocation,
  useNavigate,
} from "react-router-dom";
import img from "../assets/profile.png";
import { CgChart } from "react-icons/cg";
import { MdManageAccounts } from "react-icons/md";
import { FaX } from "react-icons/fa6";
import { BiUser } from "react-icons/bi";

const AdminLayout = () => {
  const [headText, setHeadText] = useState("Dashboard");
  const location = useLocation();
  const [isNavOpen, setNavOpen] = useState(false);
  const [dropDownOpen, setDropDownOpen] = useState(false);
  const navigate = useNavigate();

  const asideLinks = [
    {
      name: "Dashboard",
      link: "/admin/dashboard",
    },
    {
      name: "Healthcare Approval",
      link: "/admin/healthcareapproval",
    },
    {
      name: "User Management",
      link: "/admin/usermanagement",
    },
    {
      name: "Form Requests",
      link: "/admin/requests",
    },
    {
      name: "Audit Logs",
      link: "/admin/logs",
    },
    {
      name: "Reports",
      link: "/admin/reports",
    },
    {
      name: "Payment Verification",
      link: "/admin/paymentsverification",
    },
  ];

  const handleLogout = () => {
    setDropDownOpen(!dropDownOpen);
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const [profilePhoto, setProfilePhoto] = useState("");

  useEffect(() => {
    const storedUserData = localStorage.getItem("userData");
    if (storedUserData) {
      const user = JSON.parse(storedUserData);
      setProfilePhoto(user.profilePhoto);
    }
  }, []);

  return (
    <div className="">
      <aside
        className={`${
          isNavOpen ? "left-0" : "-left-[100%]"
        }  bg-[#3AD1F0] shadow-md custom-scrollbar h-screen max-h-screen lg:shadow-none md:w-[15rem] fixed overflow-y-auto lg:left-0 z-20 top-0 transition-all duration-300`}
      >
        <div className=" flex flex-col">
          <div className="sticky top-0 bg-[#3AD1F0] justify-between lg:justify-center items-center h-[5.5rem] flex px-5">
            <div className="relative w-full flex flex-col items-center">
              <div className="w-44">
                <img
                  src="https://firststarconsults.com/images/logo-1.png"
                  alt=""
                  className="object-fit"
                />
              </div>
              <p className="absolute bottom-0 text-xl font-bold w-fit text-center">
                Mobile <span className="text-white">Doctor</span>
              </p>
            </div>

            <div className="flex lg:hidden items-center">
              <button className="" onClick={() => setNavOpen(!isNavOpen)}>
                <FaX className="text-white" size={18} />
              </button>
            </div>
          </div>
          <div className="mt-14 pb-10 flex flex-col gap-8 h-full">
            {asideLinks.map((link, index) => (
              <div
                key={index}
                className={`${
                  location.pathname === link.link ||
                  (location.pathname.includes(link.link) &&
                    (location.pathname.includes("/doctors") ||
                      location.pathname.includes("/patients")))
                    ? "border-l-[6px] border-white"
                    : ""
                } w-full px-5 `}
              >
                <NavLink
                  to={link.link}
                  onClick={() => {
                    setHeadText(link.name), setNavOpen(false);
                  }}
                  className={({ isActive }) => {
                    return (
                      (isActive
                        ? `bg-white text-black`
                        : "bg-none text-white  hover:bg-slate-100 hover:text-black") +
                      " text-nowrap capitalize text-base mx-auto flex p-4 rounded font-bold"
                    );
                  }}
                >
                  {link.name}
                </NavLink>
              </div>
            ))}
          </div>
        </div>
      </aside>
      <div className="lg:ml-[15rem] flex-grow shadow-2xl">
        <header className="shadow-md w-full py-8 px-5 lg:px-10">
          <div className="flex items-center justify-between h-full">
            <div className="lg:hidden">
              <button className="" onClick={() => setNavOpen(!isNavOpen)}>
                <FaBars className="font-bold" size={25} />
              </button>
            </div>
            <div className="gap-3 items-center hidden lg:flex">
              {headText === "dashboard" && <BsMenuButton size={25} />}
              {headText === "customers" && <BsPeople size={25} />}
              {headText === "KYC Management" && <MdManageAccounts size={25} />}
              {headText === "transactions" && <FaMoneyBill size={25} />}
              {headText === "kpi" && <CgChart size={25} />}
              <p className="text-2xl font-bold capitalize">{headText}</p>
            </div>
            <div className="relative">
              <button
                className="flex gap-5 items-center"
                onClick={() => setDropDownOpen(!dropDownOpen)}
              >
                <div className="text-start">
                  <p className="font-semibold text-xl">Admin</p>
                </div>
                {profilePhoto ? (
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="h-10 w-auto rounded-full"
                  />
                ) : (
                  <p>Loading...</p>
                )}
                <div className="rounded-full">
                  <FaAngleDown size={25} />
                </div>
              </button>
              {dropDownOpen && (
                <div className="top-20 w-full absolute rounded-lg p-3 z-20 flex flex-col divide-y-2 bg-white shadow-lg">
                  <Link
                    to="/admin/profile"
                    onClick={() => setDropDownOpen(!dropDownOpen)}
                    className="flex text-lg font-semibold justify-between py-5"
                  >
                    <BiUser className="" size={25} /> Profile{" "}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex text-lg font-semibold items-center gap-2 justify-between py-5"
                  >
                    <FaSignOutAlt className="text-red-500" size={25} /> Log Out{" "}
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
        <main className="p-5 lg:p-10 pb-20 min-h-[100vh]">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
