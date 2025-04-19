const User = require("../model/userModel");

module.exports = async (req, res) => {
  try {
    const { uid } = req.params;
    const updates = req.body;

    const updatedSupervisor = await User.findOneAndUpdate(
      { uid, role: "supervisor" },
      updates,
      { new: true }
    );

    if (!updatedSupervisor) {
      return res.status(404).json({
        message: "Supervisor not found or update failed.",
      });
    }

    res.status(200).json({
      message: "Supervisor updated successfully.",
      updatedSupervisor,
    });
  } catch (error) {
    console.error("Error updating supervisor:", error);

    res.status(500).json({
      message: "An error occurred while updating supervisor.",
      error: error.message,
    });
  }
};
