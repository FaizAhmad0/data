const User = require("../model/userModel");

module.exports = async (req, res) => {
  try {
    const users = await User.find({ role: "user" });

    // Send successful response
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);

    // Handle server error
    res.status(500).json({
      message: "An error occurred while fetching users.",
      error: error.message,
    });
  }
};
