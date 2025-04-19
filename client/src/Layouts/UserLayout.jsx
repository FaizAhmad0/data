import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";
import DashboardIcon from "@mui/icons-material/Dashboard";
import ConfirmationNumberIcon from "@mui/icons-material/ConfirmationNumber";
import EventIcon from "@mui/icons-material/Event";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import PrivacyTipIcon from "@mui/icons-material/PrivacyTip";
import LogoutIcon from "@mui/icons-material/Logout";
import { useNavigate, useLocation } from "react-router-dom";

const UserLayout = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation(); // To get the current route
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeLink, setActiveLink] = useState("dashboard");

  const handleLogoutClick = () => {
    localStorage.clear();
    navigate("/"); // Redirect to home after logout
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLinkClick = (link, path) => {
    setActiveLink(link); // Update active link when clicked
    navigate(path); // Navigate without reloading
  };

  // Update active link based on the current path
  useEffect(() => {
    const path = location.pathname;
    if (path.includes("userdash")) setActiveLink("dashboard");
    else if (path.includes("user-tickets")) setActiveLink("tickets");
    else if (path.includes("appointments")) setActiveLink("appointments");
    else if (path.includes("complaints")) setActiveLink("complaints");
    else if (path.includes("raise-ticket")) setActiveLink("raise-ticket");
  }, [location]); // Run this effect whenever the location changes

  return (
    <div className="flex pt-4 lg:pt-20 h-screen flex-col lg:flex-row">
      {/* Sidebar */}
      <div
        className={`fixed lg:relative top-0 left-0 h-full w-48 bg-white shadow-lg transform ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 z-20 lg:translate-x-0`}
      >
        <nav className="flex flex-col p-4 space-y-4 mt-20 lg:mt-0">
          {/* Navigation Links */}
          {[
            { name: "Dashboard", icon: <DashboardIcon />, path: "/userdash" },
            {
              name: "Tickets",
              icon: <ConfirmationNumberIcon />,
              path: "/user-tickets",
            },
            {
              name: "Appointments",
              icon: <EventIcon />,
              path: "/appointments",
            },
            {
              name: "Complaints",
              icon: <EventIcon />,
              path: "/complaints",
            },
            {
              name: "Raise Ticket",
              icon: <AddCircleIcon />,
              path: "/raise-ticket",
            },
            {
              name: "File Complaint",
              icon: <PrivacyTipIcon className="text-red-500" />,
              path: "/file-complaint",
            },
            {
              name: "Logout",
              icon: <LogoutIcon />,
              path: "/",
              action: handleLogoutClick,
            },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={() => {
                if (item.action) {
                  item.action(); // Execute the logout or other action
                } else {
                  handleLinkClick(item.name.toLowerCase(), item.path); // Update active link and navigate
                }
              }}
              className={`flex items-center space-x-3 p-2 rounded font-semibold transition duration-200 w-full text-left ${
                activeLink === item.name.toLowerCase()
                  ? "bg-blue-500 text-white"
                  : "hover:bg-blue-500 hover:text-white"
              }`}
            >
              {item.icon}
              <span className="text-sm">{item.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content Area */}
      <div className="flex-1 flex flex-col bg-gray-100">
        {/* Navbar */}
        <Navbar toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-y-auto mt-16 lg:mt-0">
          {children}
        </main>
      </div>

      {/* Overlay for Mobile Sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 lg:hidden"
          onClick={toggleSidebar}
        ></div>
      )}
    </div>
  );
};

export default UserLayout;
