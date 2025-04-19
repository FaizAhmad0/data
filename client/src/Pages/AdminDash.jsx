import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { Spin, Alert } from "antd";
import AdminLayout from "../Layouts/AdminLayout";
import {
  isToday,
  isThisWeek,
  isThisMonth,
  isThisYear,
  parseISO,
  isWithinInterval,
} from "date-fns";
import AdminUserTable from "./AdminUserTable";
import UploadUsers from "./UploadUsers";
import UserGraph from "./UserGraph";
import DownloadSampleButton from "./DownloadSampleButton";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AdminDash = () => {
  const [users, setUsers] = useState([]);
  console.log(users);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filter, setFilter] = useState("all");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });

  const fetchUsers = async () => {
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

  // Filter users based on the selected filter
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      if (!user.createdAt) return false;
      const date = parseISO(user.createdAt);

      switch (filter) {
        case "today":
          return isToday(date);
        case "week":
          return isThisWeek(date, { weekStartsOn: 1 });
        case "month":
          return isThisMonth(date);
        case "year":
          return isThisYear(date);
        case "custom":
          if (customRange.start && customRange.end) {
            return isWithinInterval(date, {
              start: new Date(customRange.start),
              end: new Date(customRange.end),
            });
          }
          return false;
        case "all":
        default:
          return true;
      }
    });
  }, [users, filter, customRange]);

  return (
    <AdminLayout>
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

        {/* Custom Date Filter */}
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

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <UserGraph allusers={filteredUsers} />
            <div className="flex items-center gap-4">
              <UploadUsers />
              <DownloadSampleButton />
            </div>
            <AdminUserTable allusers={filteredUsers} />
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminDash;
