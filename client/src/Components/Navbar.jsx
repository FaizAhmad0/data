import React, { useEffect, useState } from "react";
import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const Navbar = ({ toggleSidebar }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  const [appointmentCount, setAppointmentCount] = useState(0);
  const [isDisabled, setIsDisabled] = useState(false);

  useEffect(() => {
    // Get stored data
    const storedData = JSON.parse(localStorage.getItem("appointmentData"));
    const today = new Date().toISOString().split("T")[0];

    if (storedData && storedData.date === today) {
      setAppointmentCount(storedData.count);
      if (storedData.count >= 2) {
        setIsDisabled(true);
      }
    } else {
      // Reset counter if it's a new day
      localStorage.setItem(
        "appointmentData",
        JSON.stringify({ date: today, count: 0 })
      );
    }
  }, []);

  const handleBookAppointment = () => {
    const storedData = JSON.parse(localStorage.getItem("appointmentData"));
    const today = new Date().toISOString().split("T")[0];

    if (storedData.date === today && storedData.count >= 2) {
      setIsDisabled(true);
      return;
    }

    // Update count
    const newCount = storedData.count + 1;
    setAppointmentCount(newCount);

    localStorage.setItem(
      "appointmentData",
      JSON.stringify({ date: today, count: newCount })
    );

    if (newCount >= 2) {
      setIsDisabled(true);
    }

    navigate("/book-appointment");
  };

  return (
    <header className="fixed top-0 left-0 w-full bg-white shadow-md px-4 lg:px-8 flex items-center justify-between h-20 z-50">
      <div className="flex items-center space-x-4">
        {token && (
          <button
            onClick={toggleSidebar}
            className="text-gray-800 focus:outline-none lg:hidden"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M4 6h16M4 12h16m-7 6h7"
              ></path>
            </svg>
          </button>
        )}
        <img
          src="/logo.png"
          alt="Logo"
          className="h-14 w-auto hover:cursor-pointer"
          onClick={() => {
            if (token) {
              navigate(`/${role}dash`);
            } else {
              navigate("/");
            }
          }}
        />
      </div>
      <div>
        {token ? (
          role === "user" ? (
            <Button
              onClick={handleBookAppointment}
              type="primary"
              className="bg-gradient-to-r from-blue-800 to-blue-400 hover:from-blue-700 hover:to-blue-500 font-bold shadow-lg hover:shadow-xl"
              disabled={isDisabled}
            >
              {isDisabled ? "Book Appointment" : "Book Appointment"}
            </Button>
          ) : null
        ) : (
          <Button
            onClick={() => navigate("/login")}
            type="primary"
            className="bg-gradient-to-r from-blue-800 to-blue-400 hover:from-blue-700 hover:to-blue-500 font-bold shadow-lg hover:shadow-xl"
          >
            Raise Ticket
          </Button>
        )}
      </div>
    </header>
  );
};

export default Navbar;
