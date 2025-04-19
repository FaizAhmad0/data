const express = require("express");
const getAllManagerUser = require("../controller/getAllManagerUser"); // Correct import
const router = express.Router();

// GET request to fetch all users assigned to a manager
router.get("/get-all-user", getAllManagerUser);

module.exports = router;
