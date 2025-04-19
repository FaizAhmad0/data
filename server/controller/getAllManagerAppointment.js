const Appointment = require("../model/appointmentModel");

module.exports = async (req, res) => {
  try {
    const { name } = req.query; // Check if name is provided
    if (!name) {
      return res.status(400).json({ message: "User ID (name) is required." });
    }

    // Fetch tickets for the given name
    const allAppointment = await Appointment.find({ manager: name });

    // Respond with the tickets
    res.status(200).json({
      message: "Appointment fetched successfully.",
      appointments: allAppointment,
    });
  } catch (error) {
    console.error("Error fetching Appointment:", error);

    // Handle server error
    res.status(500).json({
      message: "An error occurred while fetching Appointment.",
      error: error.message,
    });
  }
};
