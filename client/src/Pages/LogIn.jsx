import React, { useEffect } from "react";
import { Button, Input, Form, message } from "antd";
import AOS from "aos";
import "aos/dist/aos.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const LogIn = () => {
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1200, once: false });
    AOS.refresh();
  }, []);

  const onFinish = async (values) => {
    try {
      const response = await axios.post(`${backendUrl}/login`, values, {
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        message.success(response.data.message);
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("phone", response.data.phone);
        localStorage.setItem("name", response.data.name);
        localStorage.setItem("email", response.data.email);
        localStorage.setItem("uid", response.data.uid);
        localStorage.setItem(
          "enrollmentIdAmazon",
          response.data.enrollmentIdAmazon
        );
        localStorage.setItem(
          "enrollmentIdWebsite",
          response.data.enrollmentIdWebsite
        );
        localStorage.setItem("id", response.data.id);
        localStorage.setItem("role", response.data.role);

        switch (response.data.role) {
          case "user":
            navigate("/userdash");
            break;
          case "admin":
            navigate("/admindash");
            break;
          case "manager":
            navigate("/managerdash");
            break;
          case "supervisor":
            navigate("/supervisordash");
            break;
          default:
            message.error("Invalid role");
        }
      } else {
        message.error(response.data.message || "Login failed!");
      }
    } catch (error) {
      console.error("Error:", error);
      message.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    }
  };

  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">
      <div className="flex flex-col md:flex-row gap-6 md:gap-8 bg-transparent rounded-lg max-w-3xl w-full">
        {/* Left Panel */}
        <div
          data-aos="fade-right"
          className="w-full md:w-1/2 bg-white p-6 rounded-lg shadow-md"
        >
          <div className="text-center mb-6">
            <img src="/logo.png" alt="Logo" className="h-14 mx-auto mb-2" />
            <h2 className="text-xl font-semibold text-gray-700">Sign In</h2>
            <p className="text-gray-500 text-sm">
              Welcome Back! please enter your details
            </p>
          </div>

          <Form
            name="login"
            initialValues={{ remember: true }}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
            className="space-y-4"
          >
            <Form.Item
              name="uid"
              rules={[{ required: true, message: "Please enter your UID!" }]}
            >
              <Input
                size="large"
                placeholder="Enter uid Here"
                className="rounded-md"
              />
            </Form.Item>

            <Form.Item
              name="password"
              rules={[
                { required: true, message: "Please enter your password!" },
              ]}
            >
              <Input.Password
                size="large"
                placeholder="Enter Password"
                className="rounded-md"
              />
            </Form.Item>

            <div className="text-right text-sm text-blue-600 hover:underline">
              <a href="#">Forgot Password</a>
            </div>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                size="large"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md"
              >
                Login
              </Button>
            </Form.Item>
          </Form>

          <p className="text-xs text-center text-gray-500 mt-4">
            By login, you agree to our{" "}
            <a href="#" className="text-blue-600 hover:underline">
              Terms & Condition
            </a>
          </p>
        </div>

        {/* Right Panel */}
        <div
          data-aos="fade-left"
          className="w-full md:w-1/2 bg-blue-600 text-white p-6 rounded-lg shadow-md flex flex-col justify-center"
        >
          <h2 className="text-2xl font-bold mb-2 text-center">Welcome Back!</h2>
          <h3 className="text-lg font-semibold mb-4 text-center">
            Please sign in to your <br />
            <span className="text-white font-bold">
              Saumic Craft Data Account
            </span>
          </h3>
          <p className="text-sm text-center max-w-xs mx-auto mb-6">
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy...
          </p>

          <div className="bg-white text-black rounded-lg shadow-md p-3 w-full overflow-auto text-xs">
            <table className="w-full">
              <thead className="text-left text-gray-700">
                <tr>
                  <th>ORDER ID</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["ST#987", "James Portal", "Paid", "$123.00"],
                  ["ST#654", "Elon Test", "Pending", "$89.00"],
                  ["ST#321", "Alex Santiago", "Paid", "$150.00"],
                  ["ST#135", "Christina Crew", "Failed", "$190.00"],
                ].map(([id, customer, status, amount], i) => (
                  <tr key={i} className="border-t text-sm">
                    <td>{id}</td>
                    <td>{customer}</td>
                    <td>
                      <span
                        className={`px-2 py-1 rounded-md text-white text-xs ${
                          status === "Paid"
                            ? "bg-green-600"
                            : status === "Pending"
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                      >
                        {status}
                      </span>
                    </td>
                    <td>{amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
