import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Spin, Alert, Input } from "antd";
import {
  isToday,
  isThisWeek,
  isThisMonth,
  isThisYear,
  parseISO,
  isWithinInterval,
} from "date-fns";
import ManagerLayout from "../Layouts/ManagerLayout";
import UserTable from "./UserTable";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const ManagerDash = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    const manager = localStorage.getItem("name"); // e.g., "TL1"
    if (!manager) {
      setError("Manager not found. Please login again.");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${backendUrl}/manager/get-all-user?manager=${encodeURIComponent(
          manager
        )}`
      );

      const sortedUsers = response.data.users.sort(
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

  // 🔍 Combine search + date filters
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (!user.createdAt) return false;

      const date = parseISO(user.createdAt);

      // ✅ Date filter
      let dateMatch = false;
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
          }
          break;
        default:
          dateMatch = true;
      }

      // ✅ Search filter (case-insensitive)
      const term = searchTerm.trim().toLowerCase();
      const searchMatch =
        !term ||
        user.name?.toLowerCase().includes(term) ||
        user.email?.toLowerCase().includes(term) ||
        user.primaryContact?.toLowerCase().includes(term) ||
        user.enrollmentIdAmazon?.toLowerCase().includes(term) ||
        user.enrollmentIdWebsite?.toLowerCase().includes(term) ||
        user.enrollmentIdEtsy?.toLowerCase().includes(term);

      return dateMatch && searchMatch;
    });
  }, [users, filter, customRange, searchTerm]);

  return (
    <ManagerLayout>
      <div className="w-full pb-4 px-4 bg-gradient-to-r from-blue-500 to-red-300 shadow-lg rounded-lg">
        <div className="flex justify-between items-center w-full">
          <h1 className="text-2xl mt-4 font-bold text-white">
            All Users Associated with You
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

        {/* 🔍 Search Bar */}
        <div className="flex justify-center mb-4">
          <Input
            placeholder="Search by name, email, contact, or enrollment ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-lg shadow-sm"
            allowClear
          />
        </div>

        {/* 🗓 Filter Buttons */}
        <div className="flex flex-wrap gap-3 justify-center mb-4">
          {["all", "today", "week", "month", "year", "custom"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-1 rounded-full text-sm transition ${
                filter === f
                  ? "bg-blue-600 text-white"
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

        {/* 📅 Custom Date Range */}
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

        {/* 📊 Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <UserTable allusers={filteredUsers} />
          </div>
        )}
      </div>
    </ManagerLayout>
  );
};

export default ManagerDash;
