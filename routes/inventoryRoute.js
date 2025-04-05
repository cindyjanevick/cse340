const express = require("express");
const router = new express.Router();
const invController = require("../controllers/invController");
const utilities = require("../utilities");
const validate = require("../utilities/account-validation");

// Routes

// GET route to build the inventory by classification view
router.get("/type/:classificationId", invController.buildByClassificationId);

// Routes for Inventory Item Details
// GET route for showing inventory item details
router.get("/detail/:invId", invController.buildByInvId);


// GET new route to build the inventory management view
router.get("/", utilities.handleErrors(invController.buildManagementView));


// Routes for Adding Inventory and Classifications

// Show the form to add a new classification
router.get(
  "/add-classification", 
  utilities.handleErrors(invController.buildAddClassification));

// Handle the form submission for adding a classification
router.post(
  "/add-classification",
  validate.classificationRules(),
  validate.checkClassificationData,
  utilities.handleErrors(invController.addClassification)
);

// Show the form to add a new inventory item
router.get(
  "/add-inventory",
   utilities.handleErrors(invController.buildAddInventory));

// Handle form submission for adding a new inventory item
router.post(
  "/add-inventory",  // Same route for both GET and POST for consistency
  validate.inventoryRules(),
  validate.checkInventoryData,
  utilities.handleErrors(invController.addInventory)
);

// AJAX route to fetch inventory data by classification ID
router.get(
  "/getInventory/:classification_id",
  utilities.handleErrors(invController.getInventoryJSON)
);



// Routes for Editing an Existing Inventory Item
// GET route to show the form for editing an inventory item
router.get("/edit/:invId", utilities.handleErrors(invController.buildEditInventoryView));

// POST route to update an inventory item
router.post(
  "/edit-inventory",
  validate.newInventoryRules(),
  validate.checkUpdateData,
  utilities.handleErrors(invController.updateInventory)
);

// Routes for Deleting Inventory Items
// GET route to show the delete confirmation view for an inventory item
router.get("/delete/:invId", utilities.handleErrors(invController.buildDeleteConfirmationView));

// POST route to handle the actual deletion of an inventory item
router.post("/delete/:invId", utilities.handleErrors(invController.deleteInventoryItem));



module.exports = router;
