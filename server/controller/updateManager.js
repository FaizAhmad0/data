const User = require("../model/userModel");

module.exports = async (req, res) => {
  try {
    const { uid } = req.params;
    const updates = req.body;

    const updatedManager = await User.findOneAndUpdate(
      { uid, role: "manager" },
      updates,
      { new: true }
    );

    if (!updatedManager) {
      return res.status(404).json({
        message: "Manager not found or update failed.",
      });
    }

    res.status(200).json({
      message: "Manager updated successfully.",
      updatedManager,
    });
  } catch (error) {
    console.error("Error updating manager:", error);

    res.status(500).json({
      message: "An error occurred while updating manager.",
      error: error.message,
    });
  }
};
