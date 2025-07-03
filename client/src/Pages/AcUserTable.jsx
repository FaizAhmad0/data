import React, { useState } from "react";
import { Table, Button, Modal, Form, Input, Tag, message } from "antd";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const AcUserTable = ({ allusers }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [selectedUser, setSelectedUser] = useState(null);
  const [documentType, setDocumentType] = useState(""); // "gst" or "legality"
  const [loading, setLoading] = useState(false);

  const openModal = (user, type) => {
    setSelectedUser(user);
    setDocumentType(type);
    setIsModalOpen(true);
    form.resetFields();
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await axios.post(`${backendUrl}/accountant/upload-doc`, {
        userId: selectedUser._id,
        type: documentType,
        link: values.link,
      });
      message.success(
        `${documentType.toUpperCase()} link uploaded successfully`
      );
      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      message.error("Failed to upload. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderLinkOrButton = (record, type) => {
    const fieldName = type === "gst" ? "gstLink" : "legalityLink";
    const link = record[fieldName];
    if (link) {
      return (
        <a href={link} target="_blank" rel="noopener noreferrer">
          <Tag color="green">View</Tag>
        </a>
      );
    }
    return (
      <Button
        type="primary"
        size="small"
        onClick={() => openModal(record, type)}
      >
        Add
      </Button>
    );
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
    },
    {
      title: "Mobile",
      dataIndex: "primaryContact",
      render: (text) => {
        if (!text) return "-";
        const lastFour = text.slice(-4);
        return `XXXXXX${lastFour}`;
      },
    },
    {
      title: "Batch",
      render: (_, record) =>
        record.batchAmazon || record.batchWebsite || record.batchEtsy || "-",
    },
    {
      title: "A. Enrollment",
      dataIndex: "enrollmentIdAmazon",
    },
    {
      title: "W. Enrollment",
      dataIndex: "enrollmentIdWebsite",
    },
    {
      title: "E. Enrollment",
      dataIndex: "enrollmentIdEtsy",
    },
    {
      title: "GST Link",
      render: (_, record) => renderLinkOrButton(record, "gst"),
    },
    {
      title: "Legality Link",
      render: (_, record) => renderLinkOrButton(record, "legality"),
    },
  ];

  return (
    <>
      <Table
        bordered
        columns={columns}
        dataSource={allusers}
        rowKey="_id"
        scroll={{ x: "max-content" }}
      />

      <Modal
        title={`Upload ${documentType.toUpperCase()} Link`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        okText="Upload"
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="link"
            label="GDrive Link"
            rules={[
              { required: true, message: "Please enter the GDrive link" },
              {
                type: "url",
                message:
                  "Please enter a valid URL (must start with http/https)",
              },
            ]}
          >
            <Input placeholder="https://drive.google.com/..." />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AcUserTable;
