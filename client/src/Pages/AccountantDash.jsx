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
import AccountantLayout from "../Layouts/AccountantLayout";
import AcUserTable from "./AcUserTable"; // Create or reuse this component

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AccountantDash = () => {
  const [users, setUsers] = useState([]);
  console.log(users);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filter, setFilter] = useState("all");
  const [customRange, setCustomRange] = useState({ start: "", end: "" });

  const [batchFilter, setBatchFilter] = useState("");
  const [searchFilter, setSearchFilter] = useState("");

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${backendUrl}/admin/get-all-user`);
      const sortedUsers = response.data.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
      setUsers(sortedUsers);
    } catch (err) {
      setError("Failed to fetch users.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const batchText = batchFilter.trim().toLowerCase();
    const searchText = searchFilter.trim().toLowerCase();

    return users.filter((user) => {
      const validDates = [user.dateAmazon, user.dateWebsite, user.dateEtsy]
        .filter(Boolean)
        .map((d) => {
          try {
            return parseISO(d);
          } catch {
            return null;
          }
        })
        .filter((d) => d instanceof Date && !isNaN(d));

      const dateMatches =
        filter === "today"
          ? validDates.some((d) => isToday(d))
          : filter === "week"
          ? validDates.some((d) => isThisWeek(d, { weekStartsOn: 1 }))
          : filter === "month"
          ? validDates.some((d) => isThisMonth(d))
          : filter === "year"
          ? validDates.some((d) => isThisYear(d))
          : filter === "custom"
          ? customRange.start && customRange.end
            ? validDates.some((d) =>
                isWithinInterval(d, {
                  start: new Date(customRange.start),
                  end: new Date(customRange.end),
                })
              )
            : false
          : true;

      const batchMatches = batchText
        ? [user.batchAmazon, user.batchWebsite, user.batchEtsy].some((batch) =>
            batch?.toLowerCase().includes(batchText)
          )
        : true;

      const searchMatches = searchText
        ? [
            user.enrollment,
            user.mobile,
            user.primaryContact,
            user.enrollmentIdAmazon,
            user.enrollmentIdWebsite,
            user.enrollmentIdEtsy,
          ].some((field) => field?.toLowerCase().includes(searchText))
        : true;

      return dateMatches && batchMatches && searchMatches;
    });
  }, [users, filter, customRange, batchFilter, searchFilter]);

  return (
    <AccountantLayout>
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

        {/* Date Filter Buttons */}
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

        {/* Custom Date Inputs */}
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

        {/* Search Inputs */}
        <div className="flex flex-col md:flex-row justify-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search by batch"
            value={batchFilter}
            onChange={(e) => setBatchFilter(e.target.value)}
            className="border px-4 py-2 rounded w-full max-w-md"
          />
          <input
            type="text"
            placeholder="Search by enrollment/contact/mobile"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            className="border px-4 py-2 rounded w-full max-w-md"
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <AcUserTable allusers={filteredUsers} />
          </div>
        )}
      </div>
    </AccountantLayout>
  );
};

export default AccountantDash;
