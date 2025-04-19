import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Popconfirm,
  message,
  Modal,
  Form,
  Tag,
  Tooltip,
  Input,
} from "antd";
import EditIcon from "@mui/icons-material/Edit";
import { CopyOutlined } from "@ant-design/icons";

import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import AdminLayout from "../Layouts/AdminLayout";
import CreateNewSupervisor from "./CreateNewSupervisor";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AllSupervisors = () => {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingSupervisor, setEditingSupervisor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState("");

  const fetchSupervisors = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/admin/get-all-supervisors`);
      setSupervisors(res.data);
    } catch (error) {
      console.error("Error fetching supervisors:", error);
      message.error("Failed to fetch supervisors");
    } finally {
      setLoading(false);
    }
  };

  const deleteSupervisor = async (uid) => {
    try {
      await axios.delete(`${backendUrl}/admin/delete-supervisor/${uid}`);
      message.success("Supervisor deleted successfully");
      fetchSupervisors();
    } catch (error) {
      console.error("Error deleting supervisor:", error);
      message.error("Failed to delete supervisor");
    }
  };

  const handleEdit = (supervisor) => {
    setEditingSupervisor(supervisor);
    form.setFieldsValue(supervisor);
    setIsModalOpen(true);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      await axios.put(
        `${backendUrl}/admin/update-supervisor/${editingSupervisor.uid}`,
        values
      );
      message.success("Supervisor updated successfully");
      setIsModalOpen(false);
      fetchSupervisors();
    } catch (error) {
      console.error("Error updating supervisor:", error);
      message.error("Failed to update supervisor");
    }
  };

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const filteredSupervisors = supervisors.filter(
    (supervisor) =>
      supervisor.name.toLowerCase().includes(searchText.toLowerCase()) ||
      supervisor.primaryContact.includes(searchText)
  );

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
                // Optional: AntD message or notification
                message.success("Copied UID to clipboard!");
              }}
              style={{ cursor: "pointer", color: "#1890ff" }}
            />
          </Tooltip>
        </div>
      ),
    },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Primary Contact",
      dataIndex: "primaryContact",
      key: "primaryContact",
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
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          <Button
            size="small"
            icon={<EditIcon />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure to delete this supervisor?"
            onConfirm={() => deleteSupervisor(record.uid)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger size="small" icon={<DeleteIcon />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div>
        <div className="w-full pb-4 px-4 bg-gradient-to-r from-blue-500 to-red-300 shadow-lg rounded-lg">
          <div className="flex justify-between items-center w-full">
            <h1 className="text-2xl font-bold text-white">All Supervisor</h1>
            <CreateNewSupervisor />
          </div>
          <div className="mt-4">
            <Input
              placeholder="Search by name or primary contact"
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow">
          <Table
            bordered
            columns={columns}
            dataSource={filteredSupervisors}
            rowKey="uid"
            loading={loading}
            pagination={{ pageSize: 20 }}
            scroll={{ x: 900 }}
          />
        </div>

        <Modal
          title="Edit Supervisor"
          open={isModalOpen}
          onOk={handleModalOk}
          onCancel={() => setIsModalOpen(false)}
          okText="Save"
          centered
          width={400}
        >
          <Form layout="vertical" form={form} className="pt-2">
            <Form.Item label="Name" name="name" rules={[{ required: true }]}>
              <Input placeholder="Enter name" />
            </Form.Item>
            <Form.Item label="Email" name="email" rules={[{ required: true }]}>
              <Input placeholder="Enter email" />
            </Form.Item>
            <Form.Item
              label="Primary Contact"
              name="primaryContact"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter contact number" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[{ required: true }]}
            >
              <Input.Password placeholder="Enter password" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AdminLayout>
  );
};

export default AllSupervisors;
