/* ***************************
* Account routes
* Unit 4, deliver login view activity
* **************************** */

//Needed Resources

const express = require("express");
const router = new express.Router();
const utilities = require("../utilities/");
const accountController = require("../controllers/accountController");
console.log(accountController);  // Check if buildAccountType exists
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


// Update Account Type only Admin
router.get(
  "/accounttype",
  utilities.adminType, 
  utilities.handleErrors(accountController.buildAccountType))

  // router.get("/accounttype", (req, res) => {
  //   res.send("This route is working!");
  // });


router.get("/update", utilities.handleErrors(accountController.buildUpdateAccount))

// This handles the account update form submission
router.post(
  "/update",
  regValidate.updateAccountRules(),
  regValidate.checkUpdAccData, 
  utilities.handleErrors(accountController.updateAccount)
)


router.post(
    "/updatetype",
    utilities.adminType,
    regValidate.updateTypeRules(),
    regValidate.checkUpdateTypeData,
    utilities.handleErrors(accountController.updateType)
  );
  
  router.post('/update-pass',
    regValidate.passwordRules(),
    regValidate.checkUpdatePassword,
    utilities.handleErrors(accountController.updatePassword))
  





//Logout Account
router.get("/logout", accountController.logoutAccount)


router.use(utilities.checkJWTToken)




console.log("accountRoute is being loaded");

module.exports = router;