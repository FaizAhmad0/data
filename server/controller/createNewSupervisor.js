const User = require("../model/userModel"); // adjust the path if needed

module.exports = async (req, res) => {
  try {
    const { name, email, primaryContact, password } = req.body;

    // Check for missing fields
    if (!name || !email || !primaryContact || !password) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Check if manager already exists
    const existingManager = await User.findOne({ primaryContact });
    if (existingManager) {
      return res
        .status(409)
        .json({ message: "A manager with this contact already exists." });
    }

    // Get the last uid and increment it
    const lastUser = await User.findOne().sort({ uid: -1 }).limit(1);
    const newUid = lastUser ? lastUser.uid + 1 : 1;

    // Create the manager object
    const newManager = new User({
      uid: newUid,
      name,
      email,
      primaryContact,
      password,
      role: "supervisor", // Optional: if you distinguish roles
    });

    await newManager.save();

    return res.status(201).json({
      message: "Manager created successfully.",
      manager: newManager,
    });
  } catch (error) {
    console.error("Error creating manager:", error);
    return res.status(500).json({
      message: "An error occurred while creating the manager.",
      error: error.message,
    });
  }
};
