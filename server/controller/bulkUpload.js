// const User = require("../model/userModel");

// module.exports = async (req, res) => {
//   try {
//     const usersData = req.body;

//     if (!Array.isArray(usersData) || usersData.length === 0) {
//       return res.status(400).json({ message: "Invalid or empty data." });
//     }

//     // Get last UID from database
//     const lastUser = await User.findOne().sort({ uid: -1 }).limit(1);
//     let currentUid = lastUser?.uid || 0;

//     const createdUsers = [];
//     const updatedUsers = [];
//     const skippedUsers = [];

//     for (const user of usersData) {
//       const {
//         name,
//         email,
//         enrollment,
//         primaryContact,
//         date,
//         batch,
//         manager,
//         enrolledBy,
//       } = user;

//       if (
//         !name ||
//         !email ||
//         !enrollment ||
//         !primaryContact ||
//         !date ||
//         !batch ||
//         !manager
//       ) {
//         skippedUsers.push({
//           primaryContact,
//           reason: "Missing required fields.",
//         });
//         continue;
//       }

//       const namePrefix = String(name).slice(0, 2).toLowerCase();
//       const mobileSuffix = String(primaryContact).slice(-2);
//       const enrollmentPrefix = String(enrollment).slice(0, 2).toUpperCase();

//       const existingUser = await User.findOne({ primaryContact });

//       // Check if manager exists
//       const tl = await User.findOne({ name: manager });
//       if (!tl) {
//         skippedUsers.push({
//           primaryContact,
//           reason: `${manager} is not defined as a manager.`,
//         });
//         continue;
//       }

//       if (existingUser) {
//         let updated = false;

//         if (enrollmentPrefix === "AZ" && !existingUser.enrollmentIdAmazon) {
//           existingUser.enrollmentIdAmazon = enrollment;
//           existingUser.amazonManager = manager;
//           existingUser.batchAmazon = batch;
//           existingUser.dateAmazon = date;
//           updated = true;
//         } else if (
//           enrollmentPrefix === "WB" &&
//           !existingUser.enrollmentIdWebsite
//         ) {
//           existingUser.enrollmentIdWebsite = enrollment;
//           existingUser.websiteManager = manager;
//           existingUser.batchWebsite = batch;
//           existingUser.dateWebsite = date;
//           updated = true;
//         } else if (
//           enrollmentPrefix === "ET" &&
//           !existingUser.enrollmentIdEtsy
//         ) {
//           existingUser.enrollmentIdEtsy = enrollment;
//           existingUser.etsyManager = manager;
//           existingUser.batchEtsy = batch;
//           existingUser.dateEtsy = date;
//           updated = true;
//         }

//         if (updated) {
//           await existingUser.save();
//           updatedUsers.push(existingUser);
//         } else {
//           skippedUsers.push({
//             primaryContact,
//             reason: "Enrollment already exists for this contact.",
//           });
//         }

//         continue;
//       }

//       // Create new user
//       currentUid += 1;
//       const password =
//         `UID${currentUid}@${namePrefix}@${mobileSuffix}`.toUpperCase();

//       const newUserData = {
//         uid: currentUid,
//         name,
//         email,
//         primaryContact,
//         password,
//         enrolledBy,
//       };

//       if (enrollmentPrefix === "AZ") {
//         newUserData.enrollmentIdAmazon = enrollment;
//         newUserData.amazonManager = manager;
//         newUserData.batchAmazon = batch;
//         newUserData.dateAmazon = date;
//       } else if (enrollmentPrefix === "WB") {
//         newUserData.enrollmentIdWebsite = enrollment;
//         newUserData.websiteManager = manager;
//         newUserData.batchWebsite = batch;
//         newUserData.dateWebsite = date;
//       } else if (enrollmentPrefix === "ET") {
//         newUserData.enrollmentIdEtsy = enrollment;
//         newUserData.etsyManager = manager;
//         newUserData.batchEtsy = batch;
//         newUserData.dateEtsy = date;
//       } else {
//         newUserData.enrollment = enrollment;
//         newUserData.manager = manager;
//         newUserData.batch = batch;
//         newUserData.date = date;
//       }

//       const newUser = new User(newUserData);
//       await newUser.save();
//       createdUsers.push(newUser);
//     }

//     res.status(200).json({
//       message: "Bulk user processing completed.",
//       created: createdUsers.length,
//       updated: updatedUsers.length,
//       skipped: skippedUsers.length,
//       createdUsers,
//       updatedUsers,
//       skippedUsers,
//     });
//   } catch (error) {
//     console.error("Error in bulk user upload:", error);
//     res.status(500).json({
//       message: "An error occurred during bulk upload.",
//       error: error.message,
//     });
//   }
// };

const User = require("../model/userModel");
const XLSX = require("xlsx");

module.exports = async (req, res) => {
  try {
    const usersData = req.body;

    if (!Array.isArray(usersData) || usersData.length === 0) {
      return res.status(400).json({ message: "Invalid or empty data." });
    }

    const lastUser = await User.findOne().sort({ uid: -1 }).limit(1);
    let currentUid = lastUser?.uid || 0;

    const createdUsers = [];
    const updatedUsers = [];
    const skippedUsers = [];

    for (const user of usersData) {
      const {
        name,
        email,
        enrollment,
        primaryContact,
        date,
        batch,
        manager,
        enrolledBy,
      } = user;

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
          enrollment,
          reason: "Missing required fields.",
        });
        continue;
      }

      const namePrefix = String(name).slice(0, 2).toLowerCase();
      const mobileSuffix = String(primaryContact).slice(-2);
      const enrollmentPrefix = String(enrollment).slice(0, 2).toUpperCase();

      const existingUser = await User.findOne({ primaryContact });

      const tl = await User.findOne({ name: manager });
      if (!tl) {
        skippedUsers.push({
          enrollment,
          reason: `${manager} is not defined as a manager.`,
        });
        continue;
      }

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
            enrollment,
            reason: "Enrollment already exists for this contact.",
          });
        }

        continue;
      }

      // Create new user (even if email already exists)
      currentUid += 1;
      const password =
        `UID${currentUid}@${namePrefix}@${mobileSuffix}`.toUpperCase();

      const newUserData = {
        uid: currentUid,
        name,
        email,
        primaryContact,
        password,
        enrolledBy,
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

    // Export skipped users to Excel if any
    if (skippedUsers.length > 0) {
      const worksheet = XLSX.utils.json_to_sheet(skippedUsers);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Skipped Users");

      const buffer = XLSX.write(workbook, {
        type: "buffer",
        bookType: "xlsx",
      });

      res.setHeader(
        "Content-Disposition",
        "attachment; filename=skipped_users.xlsx"
      );
      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      return res.status(200).send(buffer);
    }

    // If no skipped users, send JSON
    res.status(200).json({
      message: "Bulk user processing completed.",
      created: createdUsers.length,
      updated: updatedUsers.length,
      skipped: skippedUsers.length,
      createdUsers,
      updatedUsers,
    });
  } catch (error) {
    console.error("Error in bulk user upload:", error);
    res.status(500).json({
      message: "An error occurred during bulk upload.",
      error: error.message,
    });
  }
};
