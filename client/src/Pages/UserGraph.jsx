import React, { useState, useEffect } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

const UserGraph = ({ allusers }) => {
  // Count for the categories
  const amazonCount = allusers.filter((u) => u.enrollmentIdAmazon).length;
  const websiteCount = allusers.filter((u) => u.enrollmentIdWebsite).length;
  const etsyCount = allusers.filter((u) => u.enrollmentIdEtsy).length;
  const amazonWebsiteCount = allusers.filter(
    (u) => u.enrollmentIdAmazon && u.enrollmentIdWebsite
  ).length;
  const amazonEtsyCount = allusers.filter(
    (u) => u.enrollmentIdAmazon && u.enrollmentIdEtsy
  ).length;

  // Prepare data for PieChart
  const pieData = [
    { name: "Amazon", value: amazonCount },
    { name: "Website", value: websiteCount },
    { name: "Etsy", value: etsyCount },
    { name: "Amazon & Website", value: amazonWebsiteCount },
    { name: "Amazon & Etsy", value: amazonEtsyCount },
  ];

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#FF6347"];

  return (
    <div className="flex justify-center mb-6">
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={pieData}
            cx="50%"
            cy="50%"
            innerRadius="50%"
            outerRadius="80%"
            fill="#8884d8"
            dataKey="value"
          >
            {pieData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default UserGraph;
