// index.js
const express = require("express");
const mongoose = require("mongoose");
const User = require("../model/userModel");

const app = express();
const PORT = 8500;

// Connect to MongoDB
mongoose
  .connect(
    "mongodb+srv://saumic:saumic123@cluster0.pxceo4x.mongodb.net/crm?retryWrites=true&w=majority&appName=Cluster0",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

const updateTLUsersToManager = async () => {
  try {
    const result = await User.updateMany(
      { name: { $regex: /^TL/, $options: "i" } }, // name starts with 'TL', case-insensitive
      { $set: { role: "manager" } }
    );

    console.log(`Updated ${result.modifiedCount} users to role 'manager'.`);
  } catch (error) {
    console.error("Error updating roles:", error);
  }
};

updateTLUsersToManager();





app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
