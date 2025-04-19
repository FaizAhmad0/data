const express = require("express");
const router = express.Router();
const login = require("../controller/Login");

// Route for login
router.post("/", login);

module.exports = router;
