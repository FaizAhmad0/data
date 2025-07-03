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

const updateManagerToAccountant = async () => {
  try {
    const user = await User.find({
      uid: 28,
    });
    if (!user) {
      console.log("Manager with the given email not found.");
      return;
    }

    user.role = "accountant";
    await user.save();
    console.log("Role updated to accountant for:", user.email);
  } catch (error) {
    console.error("Error updating role:", error);
  }
};

// Call the function
updateManagerToAccountant();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
