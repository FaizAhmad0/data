const User = require("../model/userModel");

module.exports = async (req, res) => {
  try {
    const { uid } = req.params;

    const deletedManager = await User.findOneAndDelete({
      uid,
      role: "manager",
    });

    if (!deletedManager) {
      return res.status(404).json({
        message: "Manager not found or already deleted.",
      });
    }

    res.status(200).json({
      message: "Manager deleted successfully.",
      deletedManager,
    });
  } catch (error) {
    console.error("Error deleting manager:", error);

    res.status(500).json({
      message: "An error occurred while deleting manager.",
      error: error.message,
    });
  }
};
