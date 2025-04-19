import React from "react";
import { Button } from "antd";
import {
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  LinkedinOutlined,
} from "@ant-design/icons";

const Footer = () => {
  return (
    <footer className="w-full text-black shadow-md px-4 py-6 lg:px-8 lg:py-6 flex flex-col lg:flex-row items-center justify-between space-y-4 lg:space-y-0">
      <div className="flex items-center justify-center lg:justify-start">
        <img src="/logo.png" alt="Logo" className="h-12 w-auto" />
      </div>
      <div className="flex items-center justify-center space-x-4">
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black text-xl hover:text-blue-700"
          aria-label="Facebook"
        >
          <FacebookOutlined />
        </a>
        <a
          href="https://twitter.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black text-xl hover:text-blue-700"
          aria-label="Twitter"
        >
          <TwitterOutlined />
        </a>
        <a
          href="https://www.instagram.com/crarts_decor/"
          target="Crars_Decor"
          rel="noopener noreferrer"
          className="text-black text-xl hover:text-red-800"
          aria-label="Instagram"
        >
          <InstagramOutlined />
        </a>
        <a
          href="https://linkedin.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-black text-xl hover:text-blue-700"
          aria-label="LinkedIn"
        >
          <LinkedinOutlined />
        </a>
      </div>
      <div className="flex justify-center lg:justify-end">
        <Button
          type="primary"
          className="bg-gradient-to-r from-blue-800 to-blue-400 hover:from-blue-700 hover:to-blue-500 font-bold shadow-lg hover:shadow-xl text-white"
        >
          Contact Us
        </Button>
      </div>
    </footer>
  );
};

export default Footer;
