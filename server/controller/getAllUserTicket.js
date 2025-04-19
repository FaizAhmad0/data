const Ticket = require("../model/ticketModel");

module.exports = async (req, res) => {
  try {
    const { uid } = req.query;

    // Check if UID is provided
    if (!uid) {
      return res.status(400).json({ message: "User ID (uid) is required." });
    }

    // Fetch tickets for the given UID
    const alltickets = await Ticket.find({ uid });

    // Respond with the tickets
    res.status(200).json({
      message: "Tickets fetched successfully.",
      tickets: alltickets,
    });
  } catch (error) {
    console.error("Error fetching tickets:", error);

    // Handle server error
    res.status(500).json({
      message: "An error occurred while fetching tickets.",
      error: error.message,
    });
  }
};
