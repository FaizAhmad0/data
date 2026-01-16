// index.js
const express = require("express");
const mongoose = require("mongoose");
const User = require("../model/userModel");
const dotenv = require("dotenv");

const app = express();
const PORT = 8500;
dotenv.config();

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
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

// updateTLUsersToManager();
// Function to bulk update Etsy Manager for given UIDs
async function updateEtsyManagers() {
  try {
    const uids = [
      3751, 3750, 3744, 3743, 3742, 3741, 3740, 3739, 3738, 3737, 3736, 3735,
      3734, 3733, 3732, 3731, 3730, 3729, 3728, 3727, 3726, 3725, 3724, 3723,
      3708, 3173, 2957, 2773, 2597, 2469, 2329, 2217, 2191, 1863, 1558, 1493,
      664, 531, 432, 380, 375, 338, 181,
    ];

    // Step 1: Find which UIDs actually exist
    const existingUsers = await User.find(
      { uid: { $in: uids } },
      { uid: 1 }
    ).lean();
    const existingUIDs = existingUsers.map((u) => u.uid);

    console.log("Existing UIDs:", existingUIDs);
    console.log(
      "Missing UIDs:",
      uids.filter((id) => !existingUIDs.includes(id))
    );

    // Step 2: Perform the update
    const result = await User.updateMany(
      { uid: { $in: uids } },
      { $set: { etsyManager: "ETSY TL" } }
    );

    console.log(
      `Matched: ${result.matchedCount}, Modified: ${result.modifiedCount}`
    );
  } catch (error) {
    console.error("Error updating Etsy managers:", error);
  }
}

updateEtsyManagers();





app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
