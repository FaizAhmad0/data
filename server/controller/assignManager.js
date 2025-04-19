const User = require("../model/userModel");

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, name } = req.body; // type: amazonManager, websiteManager, etsyManager

    if (!type || !name) {
      return res
        .status(400)
        .json({ message: "Manager type and name are required." });
    }

    const validTypes = ["amazonManager", "websiteManager", "etsyManager"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid manager type." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { [type]: name },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Send successful response
    res.status(200).json({
      message: "Manager assigned successfully.",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error assigning manager:", error);

    // Handle server error
    res.status(500).json({
      message: "An error occurred while assigning the manager.",
      error: error.message,
    });
  }
};
