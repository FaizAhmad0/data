import React, { useState, useEffect } from "react";
import { Table, Tag, Tooltip, message } from "antd";
import moment from "moment";
import { CopyOutlined } from "@ant-design/icons";

const maskEmail = (email) => {
  if (!email) return "N/A";
  const [user, domain] = email.split("@");
  const maskedUser = user.slice(0, 2) + "****";
  return `${maskedUser}@${domain}`;
};

const maskPhone = (phone) => {
  if (!phone || phone.length < 4) return "N/A";
  return "******" + phone.slice(-4);
};

const UserTable = ({ allusers }) => {
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    setFilteredUsers(allusers || []);
  }, [allusers]);

  const columns = [
    {
      title: "UID",
      dataIndex: "uid",
      render: (uid) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <Tag color="blue">UID{uid}</Tag>
          <Tooltip title="Copy UID">
            <CopyOutlined
              onClick={() => {
                navigator.clipboard.writeText(`UID${uid}`);
                message.success("Copied UID to clipboard!");
              }}
              style={{ cursor: "pointer", color: "#1890ff" }}
            />
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Password",
      dataIndex: "password",
      render: (password) => (
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span>{password}</span>
          <Tooltip title="Copy Password">
            <CopyOutlined
              onClick={() => {
                navigator.clipboard.writeText(password);
                message.success("Password copied!");
              }}
              style={{ cursor: "pointer", color: "#1890ff" }}
            />
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Date (AMAZON)",
      dataIndex: "dateAmazon",
      render: (date) => (date ? moment(date).format("YYYY-MM-DD") : "N/A"),
    },
    {
      title: "E. ID AMAZON",
      dataIndex: "enrollmentIdAmazon",
    },
    {
      title: "Date (WEBSITE)",
      dataIndex: "dateWebsite",
      render: (date) => (date ? moment(date).format("YYYY-MM-DD") : "N/A"),
    },
    {
      title: "E. ID WEBSITE",
      dataIndex: "enrollmentIdWebsite",
    },
    {
      title: "Batch (WEBSITE)",
      dataIndex: "batchWebsite",
    },
    {
      title: "Batch (AMAZON)",
      dataIndex: "batchAmazon",
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 180,
    },
    {
      title: "Email",
      dataIndex: "email",
      render: (email) => maskEmail(email),
    },
    {
      title: "Primary Contact",
      dataIndex: "primaryContact",
      render: (phone) => maskPhone(phone),
    },

    {
      title: "AZ Manager",
      dataIndex: "amazonManager",
    },
    {
      title: "WB Manager",
      dataIndex: "websiteManager",
    },
    {
      title: "ET Manager",
      dataIndex: "etsyManager",
    },
  ];

  return (
    <div className="overflow-x-auto">
      <Table
        bordered
        columns={columns}
        dataSource={filteredUsers}
        rowKey="_id"
        pagination={{ pageSize: 50 }}
        scroll={{ x: "max-content" }}
        className="w-full"
      />
    </div>
  );
};

export default UserTable;
