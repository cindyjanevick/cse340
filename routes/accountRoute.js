/* ***************************
* Account routes
* Unit 4, deliver login view activity
* **************************** */

//Needed Resources

const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
const regValidate = require('../utilities/account-validation')

/* ********************************
* Deliver Login View
* Unit 4, deliver login view activity
* ********************************* */

router.get("/login", utilities.handleErrors(accountController.buildLogin))


// register Route //
router.get("/register", utilities.handleErrors(accountController.buildRegister));

/// Process the registration data
router.post(
    "/register",
    regValidate.registrationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Process the login attempt
router.post(
    "/login",
    (req, res) => {
      res.status(200).send('login process')
    }
  )

module.exports = router;