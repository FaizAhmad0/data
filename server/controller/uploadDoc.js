const User = require("../model/userModel");

module.exports = async (req, res) => {
  try {
    const { userId, type, link } = req.body;

    if (!userId || !type || !link) {
      return res.status(400).json({
        message: "userId, type, and link are required.",
      });
    }

    // Validate allowed types
    if (!["gst", "legality"].includes(type)) {
      return res.status(400).json({
        message: "Invalid type. Allowed types are 'gst' and 'legality'.",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Assign to the correct hardcoded property
    if (type === "gst") {
      user.gstLink = link;
    } else if (type === "legality") {
      user.legalityLink = link;
    }

    await user.save();

    res.status(200).json({
      message: `${type.toUpperCase()} link uploaded successfully.`,
      user,
    });
  } catch (error) {
    console.error(`Error uploading ${req.body.type} link:`, error);
    res.status(500).json({
      message: `An error occurred while uploading ${req.body.type} link.`,
      error: error.message,
    });
  }
};
