const express = require("express");
const router = new express.Router();
const intentionalErrorController = require("../controllers/intentionalErrorController");
const utilities = require("../utilities");

// Route to cause 500 type error
router.get("/", utilities.handleErrors(intentionalErrorController.causeError));

module.exports = router;
