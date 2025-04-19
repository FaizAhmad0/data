const Appointment = require("../model/appointmentModel");

module.exports = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    // Find the specific appointment by ID
    const appointment = await Appointment.findOne({ appointmentId });

    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found.",
      });
    }

    // Update the status to "Completed"
    appointment.status = "Completed";
    await appointment.save();

    // Respond with the updated appointment
    res.status(200).json({
      message: "Appointment marked as completed successfully.",
      appointment,
    });
  } catch (error) {
    console.error("Error marking appointment as completed:", error);

    // Handle server error
    res.status(500).json({
      message: "An error occurred while updating the appointment.",
      error: error.message,
    });
  }
};
