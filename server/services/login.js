const generateToken = require("../utils/jwtUtils.js");
const User = require("../model/userModel.js");

module.exports = async function login(uid, password) {
  try {
    const existingUser = await User.findOne({ uid });
    if (!existingUser) {
      throw new Error("User not found");
    }
    const isPasswordValid = existingUser.password === password;
    if (!isPasswordValid) {
      throw new Error("Incorrect password!");
    }
    const token = generateToken(existingUser);
    return token;
  } catch (err) {
    // Log the error for debugging
    console.error("Error during user login:", err.message || err);
    throw new Error("Invalid credentials!"); // Return a generic error for security
  }
};
