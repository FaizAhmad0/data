const express = require("express");
const uploadDoc = require("../controller/uploadDoc");
const router = express.Router();

router.post("/upload-doc", uploadDoc);
module.exports = router;
