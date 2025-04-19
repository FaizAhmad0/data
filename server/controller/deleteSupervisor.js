const User = require("../model/userModel");

module.exports = async (req, res) => {
  try {
    const { uid } = req.params;

    const deletedSupervisor = await User.findOneAndDelete({
      uid,
      role: "supervisor",
    });

    if (!deletedSupervisor) {
      return res.status(404).json({
        message: "Supervisor not found or already deleted.",
      });
    }

    res.status(200).json({
      message: "Supervisor deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting supervisor:", error);

    res.status(500).json({
      message: "An error occurred while deleting supervisor.",
      error: error.message,
    });
  }
};
