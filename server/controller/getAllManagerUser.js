const User = require("../model/userModel");

module.exports = async (req, res) => {
  try {
    let { manager } = req.query;

    // Validate
    if (!manager) {
      return res.status(400).json({
        success: false,
        message: "Manager name is required.",
      });
    }

    // Normalize manager name
    manager = manager.trim();

    // Case-insensitive exact match regex
    const regex = new RegExp(`^${manager}$`, "i");

    // Find users where any manager field matches
    const allUsers = await User.find({
      $or: [
        { amazonManager: regex },
        { websiteManager: regex },
        { etsyManager: regex },
      ],
    }).sort({ createdAt: -1 }); // optional: sort newest first

    // Respond
    return res.status(200).json({
      success: true,
      message: "Users fetched successfully.",
      count: allUsers.length,
      users: allUsers,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching users.",
      error: error.message,
    });
  }
};
