const User = require("../model/userModel");

const updateDtSfForUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { key, value } = req.body;

    const allowedKeys = ["azdt", "azsf", "wbdt", "wbsf"];

    if (!allowedKeys.includes(key)) {
      return res.status(400).json({
        success: false,
        message: "Invalid key provided for update.",
      });
    }

    const update = {};
    update[key] = value;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found or update failed.",
      });
    }

    return res.status(200).json({
      success: true,
      message: `${key} updated successfully.`,
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user flag:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while updating the flag.",
      error: error.message,
    });
  }
};

module.exports = updateDtSfForUser;
