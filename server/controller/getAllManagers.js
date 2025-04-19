const User = require("../model/userModel");

module.exports = async (req, res) => {
  try {
    const managers = await User.find({ role: "manager" });

    // Send successful response
    res.status(200).json(managers);
  } catch (error) {
    console.error("Error fetching managers:", error);

    // Handle server error
    res.status(500).json({
      message: "An error occurred while fetching managers.",
      error: error.message,
    });
  }
};
