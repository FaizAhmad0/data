const Ticket = require("../model/ticketModel");

module.exports = async (req, res) => {
  try {
    const { response, ticketId, name, role } = req.body;

    // Validate required fields
    if (!response || !ticketId || !name) {
      return res
        .status(400)
        .json({ message: "Comment, ticketId, and name are required." });
    }

    // Find the ticket by ID
    const ticket = await Ticket.findOne({ ticketId });
    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found." });
    }
    if (role) {
      ticket.status = "Waiting for customer reply";
    } else {
      ticket.status = "Waiting for manager reply";
    }

    // Add the new comment to the comments array
    ticket.comments.push({ comment: response, name });

    // Save the updated ticket document
    await ticket.save();

    // Respond with the updated ticket
    res.status(200).json({
      message: "Comment added successfully.",
      ticket,
    });
  } catch (error) {
    console.error("Error adding comment:", error);

    // Handle server error
    res.status(500).json({
      message: "An error occurred while adding the comment.",
      error: error.message,
    });
  }
};
