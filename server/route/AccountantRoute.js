const express = require("express");
const uploadDoc = require("../controller/uploadDoc");
const ToggleStatus = require("../controller/ToggleStatus");
const router = express.Router();

router.post("/upload-doc", uploadDoc);
router.post("/toggle-doc-status/:id", ToggleStatus);
module.exports = router;
