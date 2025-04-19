const Ticket = require("../model/ticketModel");
const User = require("../model/userModel");

// Authenticate with Double Tick API

module.exports = async (req, res) => {
  console.log("working");
  try {
    const { name } = req.body;

    // Find user by name
    const user = await User.findOne({ name: name });
    if (!user) {
      return res.status(404).json({ message: "User not found!" });
    }

    // Create a new ticket using the data from the request body
    const ticketData = new Ticket(req.body);

    // Save the new ticket to the database
    await ticketData.save();

    // Send success response
    res.status(201).json({
      message: "New ticket created and WhatsApp message sent successfully!",
    });
  } catch (error) {
    console.error("Error creating ticket or sending WhatsApp message:", error);
    res
      .status(500)
      .json({ message: "Could not create ticket or send message" });
  }
};
