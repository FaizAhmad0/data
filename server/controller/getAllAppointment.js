const Appointment = require("../model/appointmentModel");

module.exports = async (req, res) => {
  try {
    const allAppointment = await Appointment.find({});

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
