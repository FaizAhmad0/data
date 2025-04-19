const Complaint = require("../model/complaintModel");

module.exports = async (req, res) => {
  try {
    const appData = new Complaint(req.body);
    await appData.save();
    res.status(200).json({ message: "New complaint created" });
  } catch (error) {
    console.error("Error creating complaint:", error);
    res.status(500).json({ message: "Could not create new complaint!" });
  }
};
