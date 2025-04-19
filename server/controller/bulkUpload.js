const User = require("../model/userModel");

module.exports = async (req, res) => {
  try {
    const usersData = req.body;

    if (!Array.isArray(usersData) || usersData.length === 0) {
      return res.status(400).json({ message: "Invalid or empty data." });
    }

    // Get last UID from database
    const lastUser = await User.findOne().sort({ uid: -1 }).limit(1);
    let currentUid = lastUser?.uid || 0;

    const createdUsers = [];
    const updatedUsers = [];
    const skippedUsers = [];

    for (const user of usersData) {
      const { name, email, enrollment, primaryContact, date, batch, manager } =
        user;

      if (
        !name ||
        !email ||
        !enrollment ||
        !primaryContact ||
        !date ||
        !batch ||
        !manager
      ) {
        skippedUsers.push({
          primaryContact,
          reason: "Missing required fields.",
        });
        continue;
      }

      const namePrefix = String(name).slice(0, 2).toLowerCase();
      const mobileSuffix = String(primaryContact).slice(-2);
      const enrollmentPrefix = String(enrollment).slice(0, 2).toUpperCase();

      const existingUser = await User.findOne({ primaryContact });

      if (existingUser) {
        let updated = false;

        if (enrollmentPrefix === "AZ" && !existingUser.enrollmentIdAmazon) {
          existingUser.enrollmentIdAmazon = enrollment;
          existingUser.amazonManager = manager;
          existingUser.batchAmazon = batch;
          existingUser.dateAmazon = date;
          updated = true;
        } else if (
          enrollmentPrefix === "WB" &&
          !existingUser.enrollmentIdWebsite
        ) {
          existingUser.enrollmentIdWebsite = enrollment;
          existingUser.websiteManager = manager;
          existingUser.batchWebsite = batch;
          existingUser.dateWebsite = date;
          updated = true;
        } else if (
          enrollmentPrefix === "ET" &&
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
          updatedUsers.push(existingUser);
        } else {
          skippedUsers.push({
            primaryContact,
            reason: "Enrollment already exists for this contact.",
          });
        }

        continue; // skip to next user
      }

      // Create new user
      currentUid += 1;
      const password =
        `UID${currentUid}@${namePrefix}@${mobileSuffix}`.toUpperCase();

      const newUserData = {
        uid: currentUid,
        name,
        email,
        primaryContact,
        password,
      };

      if (enrollmentPrefix === "AZ") {
        newUserData.enrollmentIdAmazon = enrollment;
        newUserData.amazonManager = manager;
        newUserData.batchAmazon = batch;
        newUserData.dateAmazon = date;
      } else if (enrollmentPrefix === "WB") {
        newUserData.enrollmentIdWebsite = enrollment;
        newUserData.websiteManager = manager;
        newUserData.batchWebsite = batch;
        newUserData.dateWebsite = date;
      } else if (enrollmentPrefix === "ET") {
        newUserData.enrollmentIdEtsy = enrollment;
        newUserData.etsyManager = manager;
        newUserData.batchEtsy = batch;
        newUserData.dateEtsy = date;
      } else {
        newUserData.enrollment = enrollment;
        newUserData.manager = manager;
        newUserData.batch = batch;
        newUserData.date = date;
      }

      const newUser = new User(newUserData);
      await newUser.save();
      createdUsers.push(newUser);
    }

    res.status(200).json({
      message: "Bulk user processing completed.",
      created: createdUsers.length,
      updated: updatedUsers.length,
      skipped: skippedUsers.length,
      createdUsers,
      updatedUsers,
      skippedUsers,
    });
  } catch (error) {
    console.error("Error in bulk user upload:", error);
    res.status(500).json({
      message: "An error occurred during bulk upload.",
      error: error.message,
    });
  }
};
