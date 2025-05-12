import React, { useState, useEffect } from "react";
import {
  Table,
  Tag,
  Button,
  Modal,
  Select,
  Popconfirm,
  message,
  Tooltip,
} from "antd";
import moment from "moment";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import DeleteIcon from "@mui/icons-material/Delete";
import { CSVLink } from "react-csv";
import { CopyOutlined } from "@ant-design/icons";
import axios from "axios";
const backendUrl = process.env.REACT_APP_BACKEND_URL;

const { Option } = Select;

const AdminUserTable = ({ allusers }) => {
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [activeFilter, setActiveFilter] = useState("all");

  const [assignModalVisible, setAssignModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [managerType, setManagerType] = useState(null);
  const [managerName, setManagerName] = useState(null);
  const [managers, setManagers] = useState([]);

  const fetchManagers = async () => {
    try {
      const res = await axios.get(`${backendUrl}/admin/get-all-managers`);
      setManagers(res.data);
    } catch (error) {
      console.error("Error fetching managers:", error);
      message.error("Failed to fetch managers");
    }
  };

  useEffect(() => {
    handleFilter(activeFilter);
    fetchManagers();
  }, [allusers]);

  const handleFilter = (filter) => {
    setActiveFilter(filter);
    let filtered = [...allusers];

    switch (filter) {
      case "amazon":
        filtered = allusers.filter((user) => user.enrollmentIdAmazon);
        break;
      case "website":
        filtered = allusers.filter((user) => user.enrollmentIdWebsite);
        break;
      case "etsy":
        filtered = allusers.filter((user) => user.enrollmentIdEtsy);
        break;
      case "amazon_website":
        filtered = allusers.filter(
          (user) => user.enrollmentIdAmazon && user.enrollmentIdWebsite
        );
        break;
      case "amazon_etsy":
        filtered = allusers.filter(
          (user) => user.enrollmentIdAmazon && user.enrollmentIdEtsy
        );
        break;
      case "amazon_only":
        filtered = allusers.filter(
          (user) => user.enrollmentIdAmazon && !user.enrollmentIdWebsite
        );
        break;
      case "website_only":
        filtered = allusers.filter(
          (user) => user.enrollmentIdWebsite && !user.enrollmentIdAmazon
        );
        break;
      default:
        filtered = allusers;
    }

    setFilteredUsers(filtered);
  };

  const amazonCount = allusers.filter((u) => u.enrollmentIdAmazon).length;
  const websiteCount = allusers.filter((u) => u.enrollmentIdWebsite).length;
  const etsyCount = allusers.filter((u) => u.enrollmentIdEtsy).length;
  const amazonWebsiteCount = allusers.filter(
    (u) => u.enrollmentIdAmazon && u.enrollmentIdWebsite
  ).length;
  const amazonEtsyCount = allusers.filter(
    (u) => u.enrollmentIdAmazon && u.enrollmentIdEtsy
  ).length;
  const amazonOnlyCount = allusers.filter(
    (u) => u.enrollmentIdAmazon && !u.enrollmentIdWebsite
  ).length;
  const websiteOnlyCount = allusers.filter(
    (u) => u.enrollmentIdWebsite && !u.enrollmentIdAmazon
  ).length;

  const handleDelete = async (userId) => {
    try {
      await axios.delete(`${backendUrl}/admin/delete-user/${userId}`);
      message.success("User deleted successfully");
      window.location.reload();
    } catch (err) {
      message.error("Error deleting user");
    }
  };

  const handleAssignManager = async () => {
    if (!managerType || !managerName) {
      return message.warning("Please select manager type and name.");
    }

    try {
      await axios.put(
        `${backendUrl}/admin/assign-manager/${selectedUser._id}`,
        {
          type: managerType,
          name: managerName,
        }
      );

      message.success("Manager assigned successfully!");
      setAssignModalVisible(false);
      setManagerType(null);
      setManagerName(null);
      window.location.reload();
    } catch (error) {
      console.error(error);
      message.error("Failed to assign manager.");
    }
  };

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
      title: "E. ID ETSY",
      dataIndex: "enrollmentIdEtsy",
    },
    {
      title: "Date (ETSY)",
      dataIndex: "dateEtsy",
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
      title: "Batch (ETSY)",
      dataIndex: "batchEtsy",
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
      render: (text) => {
        const role = localStorage.getItem("role");
        if (role === "admin") {
          return text;
        }
        const [username, domain] = text.split("@");
        const maskedUsername =
          username.slice(0, 2) + "*".repeat(Math.max(0, username.length - 2));
        return `${maskedUsername}@${domain}`;
      },
    },
    {
      title: "Primary Contact",
      dataIndex: "primaryContact",
      render: (text) => {
        const role = localStorage.getItem("role");
        if (role === "admin") {
          return text;
        }
        const visibleDigits = 2;
        const masked =
          "*".repeat(text.length - visibleDigits) + text.slice(-visibleDigits);
        return masked;
      },
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
    {
      title: "Action",
      render: (_, user) => (
        <div className="flex gap-2 items-center">
          <Button
            onClick={() => {
              setSelectedUser(user);
              setAssignModalVisible(true);
            }}
          >
            Assign M..
          </Button>
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(user._id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteIcon />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const csvHeaders = [
    { label: "UID", key: "uid" },
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Primary Contact", key: "primaryContact" },
    { label: "Password", key: "password" },
    { label: "Enrollment ID Amazon", key: "enrollmentIdAmazon" },
    { label: "Enrollment ID Website", key: "enrollmentIdWebsite" },
    { label: "Enrollment ID Etsy", key: "enrollmentIdEtsy" },
    { label: "Batch Amazon", key: "batchAmazon" },
    { label: "Batch Website", key: "batchWebsite" },
    { label: "Date Amazon", key: "dateAmazon" },
    { label: "Date Website", key: "dateWebsite" },
  ];

  return (
    <div className="overflow-x-auto space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap gap-2">
          <Button.Group>
            <Button
              type={activeFilter === "all" ? "primary" : "default"}
              onClick={() => handleFilter("all")}
            >
              All ({allusers.length})
            </Button>
            <Button
              type={activeFilter === "amazon" ? "primary" : "default"}
              onClick={() => handleFilter("amazon")}
            >
              Amazon ({amazonCount})
            </Button>
            <Button
              type={activeFilter === "website" ? "primary" : "default"}
              onClick={() => handleFilter("website")}
            >
              Website ({websiteCount})
            </Button>
            <Button
              type={activeFilter === "etsy" ? "primary" : "default"}
              onClick={() => handleFilter("etsy")}
            >
              Etsy ({etsyCount})
            </Button>
            <Button
              type={activeFilter === "amazon_website" ? "primary" : "default"}
              onClick={() => handleFilter("amazon_website")}
            >
              Amazon & Website ({amazonWebsiteCount})
            </Button>
            <Button
              type={activeFilter === "amazon_etsy" ? "primary" : "default"}
              onClick={() => handleFilter("amazon_etsy")}
            >
              Amazon & Etsy ({amazonEtsyCount})
            </Button>
            <Button
              type={activeFilter === "amazon_only" ? "primary" : "default"}
              onClick={() => handleFilter("amazon_only")}
            >
              Amazon Only ({amazonOnlyCount})
            </Button>
            <Button
              type={activeFilter === "website_only" ? "primary" : "default"}
              onClick={() => handleFilter("website_only")}
            >
              Website Only ({websiteOnlyCount})
            </Button>
          </Button.Group>
        </div>

        <div className="flex items-center gap-4">
          <h2 className="text-sm sm:text-base font-semibold">
            Total users: {filteredUsers.length}
          </h2>
          {localStorage.getItem("role") === "admin" && (
            <CSVLink
              data={filteredUsers}
              headers={csvHeaders}
              filename={`users-${activeFilter}.csv`}
            >
              <Button type="primary">Export CSV</Button>
            </CSVLink>
          )}
        </div>
      </div>

      <Table
        bordered
        columns={columns}
        dataSource={filteredUsers}
        rowKey="_id"
        pagination={{ pageSize: 100 }}
        scroll={{ x: "max-content" }}
        className="w-full"
      />

      <Modal
        title="Assign Manager"
        open={assignModalVisible}
        onCancel={() => setAssignModalVisible(false)}
        onOk={handleAssignManager}
        okText="Assign"
      >
        <div className="space-y-4">
          <div>
            <label>Manager Type:</label>
            <Select
              style={{ width: "100%" }}
              placeholder="Select Type"
              onChange={setManagerType}
              value={managerType}
            >
              <Option value="amazonManager">Amazon</Option>
              <Option value="websiteManager">Website</Option>
              <Option value="etsyManager">Etsy</Option>
            </Select>
          </div>
          <div>
            <label>Manager Name:</label>
            <Select
              style={{ width: "100%" }}
              placeholder="Select Manager Name"
              onChange={setManagerName}
              value={managerName}
            >
              {managers.map((manager) => (
                <Select.Option key={manager._id} value={manager.name}>
                  {manager.name}
                </Select.Option>
              ))}
            </Select>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AdminUserTable;
