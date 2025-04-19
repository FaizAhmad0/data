const Appointment = require("../model/appointmentModel");

module.exports = async (req, res) => {
  try {
    // Create a new ticket using the data from the request body
    const appData = new Appointment(req.body);
    await appData.save();
    res.status(200).json({ message: "New appointment created" });
  } catch (error) {
    // Log the error with more information
    console.error("Error creating appointment:", error);

    // Send error response with appropriate status code (500 for server error)
    res.status(500).json({ message: "Could not create new appointment!" });
  }
};
