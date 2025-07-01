import React, { useRef } from "react";
import { Button, message } from "antd";
import * as XLSX from "xlsx";
import Papa from "papaparse";
import axios from "axios";
import dayjs from "dayjs";

const backendUrl = process.env.REACT_APP_BACKEND_URL;

const UploadUsers = () => {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const fileType = file.name.split(".").pop().toLowerCase();

    if (fileType === "xlsx" || fileType === "xls") {
      handleExcelFile(file);
    } else if (fileType === "csv") {
      handleCsvFile(file);
    } else {
      message.error("Please upload a valid Excel or CSV file.");
    }
  };

  // Handle Excel file (XLSX or XLS)
  const handleExcelFile = (file) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const data = new Uint8Array(event.target.result);
      const workbook = XLSX.read(data, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const jsonData = XLSX.utils.sheet_to_json(worksheet, { raw: false });

      const formattedData = jsonData.map((row) => {
        if (row.date) {
          const parsedDate = dayjs(row.date);
          if (parsedDate.isValid()) {
            row.date = parsedDate.format("YYYY-MM-DD"); // ← Updated format
          }
        }
        return row;
      });

      try {
        const response = await axios.post(
          `${backendUrl}/admin/bulk-upload`,
          formattedData
        );
        const {
          message: successMessage,
          created,
          updated,
          skipped,
          skippedUsers,
        } = response.data;

        if (skipped > 0 && skippedUsers?.length) {
          const reasons = skippedUsers
            .map(
              (user, index) =>
                `${index + 1}. ${user.primaryContact}: ${user.reason}`
            )
            .join("\n");

          message.warning(
            `Skipped ${skipped} users:\n${reasons}`
          );
        } else {
          message.success(
            successMessage || "Excel data uploaded successfully."
          );
        }

        console.log(response.data);
      } catch (error) {
        console.error("Upload failed:", error);
        message.error(error?.response?.data?.message || error.message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Handle CSV file
  const handleCsvFile = (file) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const csvData = event.target.result;

      Papa.parse(csvData, {
        complete: async (result) => {
          const jsonData = result.data;

          const formattedData = jsonData.map((row) => {
            if (row.date) {
              const parsedDate = dayjs(row.date, ["DD-MM-YYYY", "YYYY-MM-DD"]);
              if (parsedDate.isValid()) {
                row.date = parsedDate.format("YYYY-MM-DD"); // ← Updated format
              }
            }
            return row;
          });

          try {
            const response = await axios.post(
              `${backendUrl}/admin/bulk-upload`,
              formattedData
            );
            message.success("CSV data uploaded successfully!");
            console.log("Server response:", response.data);
          } catch (error) {
            console.error("Upload failed:", error);
            message.error("Failed to upload CSV data.");
          }
        },
        header: true,
      });
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <Button className="mb-4" type="primary" onClick={handleButtonClick}>
        Upload Excel/CSV
      </Button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: "none" }}
        accept=".xlsx, .xls, .csv"
        onChange={handleFileChange}
      />
    </div>
  );
};

export default UploadUsers;
