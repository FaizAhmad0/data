import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Spin, Alert } from "antd";
import {
  isToday,
  isThisWeek,
  isThisMonth,
  isThisYear,
  parseISO,
  isWithinInterval,
} from "date-fns";
import SupervisorLayout from "../Layouts/SupervisorLayout";
import UserTable from "./UserTable";
import AdminUserTable from "./AdminUserTable";
import UploadUsers from "./UploadUsers";
import DownloadSampleButton from "./DownloadSampleButton";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const SupervisorDash = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filter, setFilter] = useState("all");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const [enrollmentSearch, setEnrollmentSearch] = useState(""); // 🔹 new state

  const fetchUsers = async () => {
    const supervisor = localStorage.getItem("name");
    if (!supervisor) {
      setError("Supervisor not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`${backendUrl}/admin/get-all-user`);
      const sortedUsers = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setUsers(sortedUsers);
    } catch (err) {
      setError("Failed to fetch users. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (!user.createdAt) return false;
      const date = parseISO(user.createdAt);

      // 🔹 filter by date
      let dateMatch = true;
      switch (filter) {
        case "today":
          dateMatch = isToday(date);
          break;
        case "week":
          dateMatch = isThisWeek(date, { weekStartsOn: 1 });
          break;
        case "month":
          dateMatch = isThisMonth(date);
          break;
        case "year":
          dateMatch = isThisYear(date);
          break;
        case "custom":
          if (customRange.start && customRange.end) {
            dateMatch = isWithinInterval(date, {
              start: new Date(customRange.start),
              end: new Date(customRange.end),
            });
          } else {
            dateMatch = false;
          }
          break;
        default:
          dateMatch = true;
      }

      // 🔹 filter by enrollment IDs
      const enrollmentMatch = enrollmentSearch
        ? [
            user.enrollmentIdAmazon,
            user.enrollmentIdWebsite,
            user.enrollmentIdEtsy,
          ].some((id) =>
            id?.toLowerCase().includes(enrollmentSearch.toLowerCase())
          )
        : true;

      return dateMatch && enrollmentMatch;
    });
  }, [users, filter, customRange, enrollmentSearch]);

  return (
    <SupervisorLayout>
      <div className="w-full pb-4 px-4 bg-gradient-to-r from-green-500 to-blue-300 shadow-lg rounded-lg">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-2xl mt-4 font-bold text-white">
            All Users Associated with You (Supervisor)
          </h1>
        </div>
      </div>
      <div className="bg-gray-50 min-h-screen p-4">
        {error && (
          <Alert
            message="Error"
            description={error}
            type="error"
            showIcon
            className="mb-4"
          />
        )}

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-4">
          {["all", "today", "week", "month", "year", "custom"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1 rounded-full text-sm transition ${
                filter === f
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              {f === "all"
                ? "All"
                : f === "today"
                ? "Today"
                : f === "week"
                ? "This Week"
                : f === "month"
                ? "This Month"
                : f === "year"
                ? "This Year"
                : "Custom"}
            </button>
          ))}
        </div>

        {/* Custom Date Range Filter */}
        {filter === "custom" && (
          <div className="flex justify-center gap-4 mb-4">
            <input
              type="date"
              value={customRange.start}
              onChange={(e) =>
                setCustomRange({ ...customRange, start: e.target.value })
              }
              className="border rounded px-2 py-1"
            />
            <input
              type="date"
              value={customRange.end}
              onChange={(e) =>
                setCustomRange({ ...customRange, end: e.target.value })
              }
              className="border rounded px-2 py-1"
            />
          </div>
        )}

        {/* 🔹 Enrollment Filter Input */}
        <div className="flex justify-center mb-4">
          <input
            type="text"
            placeholder="Search by Enrollment ID, Amazon, Website, Etsy"
            value={enrollmentSearch}
            onChange={(e) => setEnrollmentSearch(e.target.value.trim())}
            className="border rounded px-3 py-1 w-1/2"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <div className="flex items-center gap-4 mb-4">
              <UploadUsers />
              <DownloadSampleButton />
            </div>
            <AdminUserTable allusers={filteredUsers} />
          </div>
        )}
      </div>
    </SupervisorLayout>
  );
};

export default SupervisorDash;
