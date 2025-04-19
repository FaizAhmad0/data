import React, { useEffect, useState } from "react";
import { Form, Input, Button, Select, DatePicker, message } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowBack } from "@mui/icons-material";
import AOS from "aos";
import "aos/dist/aos.css";
import axios from "axios";
import dayjs from "dayjs";

const backendUrl = process.env.REACT_APP_BACKEND_URL;
const { Option } = Select;

const UserComplaint = () => {
  const getCurrentTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}`;
  };

  const currentTime = getCurrentTime();
  const [appointments, setAppointments] = useState([]);
  console.log(appointments);
  const [managers, setManagers] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedManager, setSelectedManager] = useState(null);

  const [form] = Form.useForm();
  const navigate = useNavigate();

  const fetchAppointments = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `${backendUrl}/admin/getallappointments`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const sortedAppointments = response.data.appointments.sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );

      setAppointments(sortedAppointments || []);
    } catch (error) {
      console.error(
        "Error fetching appointments:",
        error.response?.data?.message || error.message
      );
    }
  };

  useEffect(() => {
    fetchAppointments();
    AOS.init({ duration: 1200, once: false });
    AOS.refresh();

    form.setFieldsValue({
      name: localStorage.getItem("name") || "",
      email: localStorage.getItem("email") || "",
      uid: localStorage.getItem("uid") || "",
      number: localStorage.getItem("phone") || "",
    });

    const fetchManagers = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await axios.get(`${backendUrl}/user/getallmanager`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setManagers(response.data.managers || []);
        } else {
          message.error("Failed to fetch managers.");
        }
      } catch (error) {
        console.error("Error fetching managers:", error.message);
        message.error("Unable to fetch managers. Please try again later.");
      }
    };

    fetchManagers();
  }, [form]);

  const handlePlatformChange = (value) => {
    if (value === "amazon") {
      form.setFieldValue(
        "enrollment",
        localStorage.getItem("enrollmentIdAmazon")
      );
    } else if (value === "website") {
      form.setFieldValue(
        "enrollment",
        localStorage.getItem("enrollmentIdWebsite")
      );
    } else {
      form.setFieldValue("enrollment", "");
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date ? date.format("YYYY-MM-DD") : null);
    form.setFieldValue("time", null);
  };

  const handleManagerChange = (manager) => {
    setSelectedManager(manager);
    form.setFieldValue("time", null);
  };

  const onFinish = async (values) => {
    const formattedValues = {
      ...values,
      uid: localStorage.getItem("uid"),
    };

    try {
      const response = await axios.post(
        `${backendUrl}/user/filecomplaint`,
        formattedValues
      );

      if (response.status === 201 || response.status === 200) {
        message.success("File complaint successfully!");
        form.resetFields();
        navigate("/complaints");
      } else {
        message.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error("Error booking appointment:", error.message);
      message.error("Failed to file complaint. Please try again later.");
    }
  };

  const getDisabledTimes = () => {
    if (!selectedDate || !selectedManager) return [];

    return appointments
      .filter((appointment) => {
        const appointmentDate = dayjs(appointment.date).format("YYYY-MM-DD"); // Convert to comparable format
        return (
          appointmentDate === selectedDate &&
          appointment.manager === selectedManager
        );
      })
      .map((appointment) => appointment.time);
  };

  const disabledTimes = getDisabledTimes();
  const today = dayjs().format("YYYY-MM-DD");

  return (
    <div
      data-aos="fade-up"
      className="w-full mt-4 max-w-lg mx-auto p-6 sm:p-8 bg-white rounded-lg shadow-md"
    >
      <div
        className="flex items-center mb-4 cursor-pointer"
        onClick={() => navigate("/userdash")}
      >
        <ArrowBack fontSize="medium" className="text-blue-600 mr-2" />
        <span className="text-blue-600 font-medium">Back</span>
      </div>

      <h3
        className="text-3xl font-extrabold mb-6 text-center"
        style={{
          background:
            "linear-gradient(to right, rgba(0, 0, 255, 0.8), rgba(255, 0, 0, 0.8))",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        File Complaint
      </h3>

      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: "Please enter your name!" }]}
        >
          <Input placeholder="Name is auto-filled" disabled />
        </Form.Item>

        <Form.Item
          name="platform"
          label="Platform"
          rules={[{ required: true, message: "Please select a platform!" }]}
        >
          <Select
            placeholder="Choose a platform"
            onChange={handlePlatformChange}
          >
            <Option value="amazon">Amazon</Option>
            <Option value="website">Website</Option>
            <Option value="dispatch">Dispatch</Option>
            <Option value="accounts">Accounts</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="enrollment"
          label="Enrollment ID"
          rules={[{ required: true, message: "Enrollment ID is required!" }]}
        >
          <Input placeholder="Auto-filled or enter manually" />
        </Form.Item>

        <Form.Item
          name="number"
          label="Phone Number"
          rules={[{ required: true, message: "Phone number is required!" }]}
        >
          <Input placeholder="Phone number is auto-filled" disabled />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: "Please enter your email!" },
            { type: "email", message: "Please enter a valid email!" },
          ]}
        >
          <Input placeholder="Email is auto-filled" disabled />
        </Form.Item>

        <Form.Item
          name="uid"
          label="UID"
          rules={[{ required: true, message: "UID is required!" }]}
        >
          <Input placeholder="UID is auto-filled" disabled />
        </Form.Item>

        <Form.Item
          name="manager"
          label="Manager"
          rules={[{ required: true, message: "Please select a manager!" }]}
        >
          <Select
            placeholder="Choose your manager"
            onChange={handleManagerChange}
          >
            {managers.length > 0 ? (
              managers.map((manager) => (
                <Option key={manager.id} value={manager.name}>
                  {manager.name}
                </Option>
              ))
            ) : (
              <Option disabled>Loading managers...</Option>
            )}
          </Select>
        </Form.Item>

        <Form.Item
          name="subject"
          label="Subject"
          rules={[{ required: true, message: "Please enter a subject!" }]}
        >
          <Input placeholder="Enter the subject" />
        </Form.Item>

        {/* <Form.Item
          name="date"
          label="Date"
          rules={[{ required: true, message: "Please select a date!" }]}
        >
          <DatePicker
            className="w-full"
            onChange={handleDateChange}
            disabledDate={(current) =>
              current &&
              (current.isBefore(dayjs(), "day") ||
                current.day() === 0 ||
                current.day() === 6)
            }
          />
        </Form.Item> */}
        {/* <Form.Item
          name="time"
          label="Time"
          rules={[{ required: true, message: "Please select a time!" }]}
        >
          <Select placeholder="Choose a time">
            {predefinedTimes.map((time) => (
              <Option
                key={time}
                value={time}
                disabled={
                  disabledTimes.includes(time) ||
                  (selectedDate === today && time < currentTime)
                }
              >
                {time}
              </Option>
            ))}
          </Select>
        </Form.Item> */}

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: "Please enter a description!" }]}
        >
          <Input.TextArea
            placeholder="Describe the issue or purpose of the appointment"
            rows={4}
            className="resize-none"
          />
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full py-2 bg-gradient-to-r from-blue-700 to-blue-400 hover:from-blue-600 hover:to-blue-300 font-bold text-white rounded-lg"
          >
            Generate Case ID
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserComplaint;
