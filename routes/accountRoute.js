const express = require("express");
const router = express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");

//login//
router.get("/login", utilities.handleErrors(accountController.buildLogin))


// register Route //
router.get("/register", utilities.handleErrors(accountController.buildRegister));

/* ***********************
 * Registered succesfully
 *************************/
router.post('/register', utilities.handleErrors(accountController.registerAccount))

module.exports = router;