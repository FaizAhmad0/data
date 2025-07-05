const express = require("express");
const getAllUsers = require("../controller/getAllUsers");
const getAllManagers = require("../controller/getAllManagers");
const deleteManager = require("../controller/deleteManager");
const updateManager = require("../controller/updateManager");
const bulkUpload = require("../controller/bulkUpload");
const createNewUser = require("../controller/createNewUser");
const deleteUser = require("../controller/deleteUser");
const assignManager = require("../controller/assignManager");
const createNewManager = require("../controller/createNewManager");
const getAllSupervisor = require("../controller/getAllSupervisor");
const createNewSupervisor = require("../controller/createNewSupervisor");
const updateSupervisor = require("../controller/updateSupervisor");
const deleteSupervisor = require("../controller/deleteSupervisor");
const updateDtSfForUser = require("../controller/updateDtSfForUser");

const router = express.Router();

router.get("/get-all-user", getAllUsers);
router.get("/get-all-managers", getAllManagers);
router.get("/get-all-supervisors", getAllSupervisor);
router.put("/update-manager/:uid", updateManager);
router.delete("/delete-manager/:uid", deleteManager);
router.put("/update-supervisor/:uid", updateSupervisor);
router.delete("/delete-supervisor/:uid", deleteSupervisor);
router.delete("/delete-user/:id", deleteUser);
router.post("/create-user", createNewUser);
router.post("/create-manager", createNewManager);
router.post("/create-supervisor", createNewSupervisor);
router.put("/assign-manager/:id", assignManager);
router.put("/:id/update-flag", updateDtSfForUser);
router.post("/bulk-upload", bulkUpload);

module.exports = router;
