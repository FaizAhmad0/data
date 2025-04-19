const Ticket = require("../model/ticketModel");

module.exports = async (req, res) => {
  try {
    const { ticketId } = req.body;
    await Ticket.findOneAndUpdate(
      { ticketId },
      { status: "Closed" },
      { new: true }
    );
    res.json({ success: true, message: "Ticket closed successfully!" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error closing ticket." });
  }
};
