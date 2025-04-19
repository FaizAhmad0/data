import React from "react";
import { Button } from "antd";
import { DownloadOutlined } from "@ant-design/icons";

const DownloadSampleButton = () => {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/testdata.xlsx"; // file should be in the public folder
    link.download = "testdata.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Button
      className="mb-4 bg-green-500 hover:bg-green-600 text-white border-none"
      icon={<DownloadOutlined />}
      onClick={handleDownload}
    >
      Download Sample
    </Button>
  );
};

export default DownloadSampleButton;
