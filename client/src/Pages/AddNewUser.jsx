import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, DatePicker, message } from "antd";
import {
  UserOutlined,
  MailOutlined,
  NumberOutlined,
  PhoneOutlined,
  TeamOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import AdminLayout from "../Layouts/AdminLayout";
import axios from "axios";
import dayjs from "dayjs";
import { use } from "react";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const { Option } = Select;

const AddNewUser = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState([]);

  const fetchManagers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendUrl}/admin/get-all-managers`);
      setManagers(res.data);
    } catch (error) {
      console.error("Error fetching managers:", error);
      message.error("Failed to fetch managers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers();
  }, []);

  const onFinish = async (values) => {
    try {
      setLoading(true);

      // Format the date properly
      const formattedValues = {
        ...values,
        date: values.date.format("YYYY-MM-DD"),
      };

      const res = await axios.post(
        `${backendUrl}/admin/create-user`,
        formattedValues
      );

      message.success(res.data.message || "Registration success.");
      form.resetFields();
    } catch (err) {
      console.error(err);
      message.error(err.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f3f4f6] p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="flex justify-center mb-6">
          <img src="/logo.png" alt="Logo" className="h-16" />
        </div>
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: "Please enter name" }]}
          >
            <Input placeholder="Enter your name" prefix={<UserOutlined />} />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Please enter email" },
              { type: "email", message: "Enter a valid email" },
            ]}
          >
            <Input placeholder="Enter your email" prefix={<MailOutlined />} />
          </Form.Item>

          <Form.Item
            name="enrollment"
            rules={[{ required: true, message: "Please enter enrollment" }]}
          >
            <Input
              placeholder="Enter your enrollment number"
              prefix={<NumberOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="primaryContact"
            rules={[{ required: true, message: "Please enter contact" }]}
          >
            <Input
              placeholder="Enter your mobile number"
              prefix={<PhoneOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="date"
            rules={[{ required: true, message: "Select joining date" }]}
          >
            <DatePicker
              className="w-full"
              placeholder="Select date"
              prefix={<CalendarOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="batch"
            rules={[{ required: true, message: "Please enter batch" }]}
          >
            <Input
              placeholder="Enter batch number"
              prefix={<CalendarOutlined />}
            />
          </Form.Item>

          <Form.Item
            name="manager"
            rules={[{ required: true, message: "Select manager" }]}
          >
            <Select placeholder="Select manager">
              {managers.map((manager) => (
                <Select.Option key={manager._id} value={manager.name}>
                  {manager.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              loading={loading}
            >
              Register
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default AddNewUser;
