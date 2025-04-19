const Ticket = require("../model/ticketModel");

module.exports = async (req, res) => {
  try {
    const { manager } = req.query;

    // Fetch tickets for the given UID
    const alltickets = await Ticket.find({ manager: manager });

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
