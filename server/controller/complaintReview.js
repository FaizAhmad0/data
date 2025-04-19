const Complaint = require("../model/complaintModel");

module.exports = async (req, res) => {
  try {
    const { caseId, rating, message } = req.body;
    console.log(caseId);

    // Find the appointment by its appointmentId
    const appointment = await Complaint.findOne({ caseId });

    // If appointment is not found
    if (!appointment) {
      return res.status(404).json({
        message: "Appointment not found.",
      });
    }

    // Add the rating to userReview and message to comment
    appointment.userReview = {
      rating,
      comment: message,
    };

    // Save the updated appointment
    await appointment.save();

    // Respond with a success message
    res.status(200).json({
      message: "Review added successfully.",
    });
  } catch (error) {
    console.error("Error adding review:", error);
    res.status(500).json({
      message: "Failed to add review.",
    });
  }
};
