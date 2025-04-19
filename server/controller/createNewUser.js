const User = require("../model/userModel");

module.exports = async (req, res) => {
  try {
    const { name, email, enrollment, primaryContact, date, batch, manager } =
      req.body;

    // Basic validation
    if (
      !name ||
      !email ||
      !enrollment ||
      !primaryContact ||
      !date ||
      !batch ||
      !manager
    ) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const namePrefix = name.slice(0, 2).toLowerCase();
    const mobileSuffix = primaryContact.slice(-2);

    // Check if user already exists
    const existingUser = await User.findOne({ primaryContact });

    if (existingUser) {
      let updated = false;

      if (enrollment.startsWith("AZ") && !existingUser.enrollmentIdAmazon) {
        existingUser.enrollmentIdAmazon = enrollment;
        existingUser.amazonManager = manager;
        existingUser.batchAmazon = batch;
        existingUser.dateAmazon = date;
        updated = true;
      } else if (
        enrollment.startsWith("WB") &&
        !existingUser.enrollmentIdWebsite
      ) {
        existingUser.enrollmentIdWebsite = enrollment;
        existingUser.websiteManager = manager;
        existingUser.batchWebsite = batch;
        existingUser.dateWebsite = date;
        updated = true;
      } else if (
        enrollment.startsWith("ET") &&
        !existingUser.enrollmentIdEtsy
      ) {
        existingUser.enrollmentIdEtsy = enrollment;
        existingUser.etsyManager = manager;
        existingUser.batchEtsy = batch;
        existingUser.dateEtsy = date;
        updated = true;
      }

      if (updated) {
        await existingUser.save();
        return res.status(200).json({
          message: "Existing user updated with new enrollment info.",
          user: existingUser,
        });
      } else {
        return res.status(409).json({
          message:
            "User with this contact already exists and has this enrollment.",
        });
      }
    }

    // Get last uid and increment
    const lastUser = await User.findOne().sort({ uid: -1 }).limit(1);
    const newUid = lastUser && lastUser.uid ? lastUser.uid + 1 : 1;

    const password = `UID${newUid}@${namePrefix}@${mobileSuffix}`.toUpperCase();

    const userFields = {
      uid: newUid,
      name,
      email,
      primaryContact,
      password,
    };

    if (enrollment.startsWith("AZ")) {
      userFields.enrollmentIdAmazon = enrollment;
      userFields.amazonManager = manager;
      userFields.batchAmazon = batch;
      userFields.dateAmazon = date;
    } else if (enrollment.startsWith("WB")) {
      userFields.enrollmentIdWebsite = enrollment;
      userFields.websiteManager = manager;
      userFields.batchWebsite = batch;
      userFields.dateWebsite = date;
    } else if (enrollment.startsWith("ET")) {
      userFields.enrollmentIdEtsy = enrollment;
      userFields.etsyManager = manager;
      userFields.batchEtsy = batch;
      userFields.dateEtsy = date;
    } else {
      userFields.enrollment = enrollment;
      userFields.manager = manager;
      userFields.batch = batch;
      userFields.date = date;
    }

    const newUser = new User(userFields);
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({
      message: "An error occurred while creating user.",
      error: error.message,
    });
  }
};
