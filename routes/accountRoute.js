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
//Unit 4, stickiness activity
// Modified in Unit 5 Login Process activity
router.post(
    "/login",
    regValidate.loginRules(),
    regValidate.checkLoginData,
    utilities.handleErrors(accountController.accountLogin)
)
/*Route to account Management view */

router.get(
  "/",
  utilities.checkLogin,
  utilities.handleErrors(accountController.buildManagement)
);

module.exports = router;