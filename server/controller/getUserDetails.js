const User = require("../model/userModel");
const { use } = require("../route/LoginRoute");
const authService = require("../services/login");

module.exports = async (req, res) => {
  try {
    const { uid } = req.params;
    const user = await User.find({ uid });
    res.status(200).json({ message: "found data", user });
  } catch (error) {
    console.error("Error during finding user :", error);
    res.status(500).json({ error: "Server error during find user!" });
  }
};
