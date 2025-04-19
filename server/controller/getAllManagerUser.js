const User = require("../model/userModel");

module.exports = async (req, res) => {
  try {
    const { manager } = req.query;

    if (!manager) {
      return res.status(400).json({
        message: "Manager name is required.",
      });
    }

    // Find users where the manager name matches any of the three fields
    const allUsers = await User.find({
      $or: [
        { amazonManager: manager },
        { websiteManager: manager },
        { etsyManager: manager },
      ],
    });

    console.log(allUsers);

    res.status(200).json({
      message: "Users fetched successfully.",
      users: allUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      message: "An error occurred while fetching users.",
      error: error.message,
    });
  }
};
