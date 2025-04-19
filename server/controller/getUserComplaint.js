const Complaint = require("../model/complaintModel");


module.exports = async (req, res) => {
  try {
    const { uid } = req.query; // Check if UID is provided
    if (!uid) {
      return res.status(400).json({ message: "User ID (uid) is required." });
    }

    // Fetch tickets for the given UID
    const allComplaints = await Complaint.find({ uid });

    // Respond with the tickets
    res.status(200).json({
      message: "Complaints fetched successfully.",
      complaints: allComplaints,
    });
  } catch (error) {
    console.error("Error fetching Complaints:", error);

    // Handle server error
    res.status(500).json({
      message: "An error occurred while fetching complaints.",
      error: error.message,
    });
  }
};
