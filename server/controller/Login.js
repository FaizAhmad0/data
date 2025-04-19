const User = require("../model/userModel");
const { use } = require("../route/LoginRoute");
const authService = require("../services/login");

module.exports = async (req, res) => {
  try {
    const { uid: rawUid, password } = req.body;
    const uid = rawUid.replace(/^UID/, ""); // Remove "UID" prefix if it exists

    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({ message: "User not exists!" });
    }
    const name = user.name;
    console.log("Welcome back", name);
    const token = await authService(uid, password);

    res.status(200).json({
      token: token,
      name,
      email: user.email,
      uid: user.uid,
      enrollmentIdAmazon: user.enrollmentIdAmazon,
      enrollmentIdWebsite: user.enrollmentIdWebsite,
      message: "Logged in successfully!",
      id: user._id,
      role: user.role,
      phone: user.primaryContact,
    });
  } catch (error) {
    console.error("Error during user login:", error);
    res.status(500).json({ error: "Server error during login!" });
  }
};
