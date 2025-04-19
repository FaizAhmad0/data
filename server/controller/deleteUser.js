const User = require("../model/userModel");

module.exports = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Send successful response
    res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);

    // Handle server error
    res.status(500).json({
      message: "An error occurred while deleting the user.",
      error: error.message,
    });
  }
};
