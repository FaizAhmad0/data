const User = require("../model/userModel");

module.exports = async (req, res) => {
  try {
    const { id } = req.params;
    const { type, value } = req.body;

    if (!type || typeof value !== "boolean") {
      return res.status(400).json({
        message: "Document type and boolean value are required.",
      });
    }

    const validTypes = ["gstDone", "legalityDone", "billProvided"];
    if (!validTypes.includes(type)) {
      return res.status(400).json({ message: "Invalid document type." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { [type]: value },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    res.status(200).json({
      message: `${type} status updated successfully.`,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating document status:", error);
    res.status(500).json({
      message: "An error occurred while updating document status.",
      error: error.message,
    });
  }
};
