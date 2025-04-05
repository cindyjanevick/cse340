// Needed Resources
const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const validate = require("../utilities/account-validation");

// Route to build inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// New route for Inventory Item Details (check later)
router.get("/detail/:invId", invController.buildByInvId);

// New route to build Management view
router.get("/", utilities.handleErrors(invController.buildManagementView));

// Show the form to add a classification
router.get(
  "/add-classification",
  utilities.handleErrors(invController.buildAddClassification)
);

// Handle form submission
router.post(
  "/add-classification",
  validate.classificationRules(),
  validate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Show the form
router.get(
    "/add-inventory",
    utilities.handleErrors(invController.buildAddInventory)
  )
  
  // Handle the form submission
  router.post(
    "/add-inventory",
    validate.inventoryRules(),
    validate.checkInventoryData,
    utilities.handleErrors(invController.addInventory)
  )

/* *********************************************
 * Get inventory for AJAX Route
 * Unit 5, Select inv item activity
 * ******************************************** */
console.log("✅ invController.getInventoryJSON:", invController.getInventoryJSON)
router.get(
  "/getInventory/:classification_id",
  // utilities.checkAccountType,
  utilities.handleErrors(invController.getInventoryJSON)

)




module.exports = router;