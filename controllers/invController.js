const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  const className = data[0].classification_name
  res.render("./inventory/classification", {
    title: className + " vehicles",
    nav,
    grid,
  })
}

/* ***************************
 *  Build inventory Item Detail View
 * ************************** */
invCont.buildByInvId = async function(req, res, next) {
    const invId = req.params.invId
    const itemData = await invModel.getInventoryItemById(invId)
    const details = await utilities.buildItemDetailView(itemData)
    let nav = await utilities.getNav()

    res.render('./inventory/item-detail-view', {
      title: `${itemData.inv_make} ${itemData.inv_model}`,
      item: itemData,
      details,
      nav
    })
}

/* ***************************
 *  Build vehicle Management View
*   Assignement 4, task 1
 * ************************** */
invCont.buildManagementView = async function(req, res, next) {
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList()

  res.render("./inventory/management", {
    title: "Inventory Management",
    nav,
    error: null,
    notice: req.flash("notice"),
    classificationSelect,
  });
};

// Show the Add Classification form
invCont.buildAddClassification = async function (req, res) {
  let nav = await utilities.getNav()
  res.render("./inventory/add-classification", {
    title: "Add New Classification",
    nav,
    errors: null,
    notice: req.flash("notice")
  })
}

// Handle POST classification insert
invCont.addClassification = async function (req, res) {
  let nav = await utilities.getNav()
  const { classification_name } = req.body

  const result = await invModel.addClassification(classification_name)

  if (result) {
    req.flash("notice", `Successfully added "${classification_name}" classification.`)
    nav = await utilities.getNav() // refresh nav to include new classification
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
      notice: req.flash("notice")
    })
  } else {
    req.flash("notice", "Failed to add classification.")
    res.status(500).render("./inventory/add-classification", {
      title: "Add New Classification",
      nav,
      classification_name,
      errors: null,
      notice: req.flash("notice")
    })
  }
}

// Show add inventory form
invCont.buildAddInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList()
  res.render("./inventory/add-inventory", {
    title: "Add New Inventory",
    nav,
    classificationList,
    errors: null,
    notice: req.flash("notice")
  })
}

// Handle form POST
invCont.addInventory = async function (req, res) {
  let nav = await utilities.getNav()
  let classificationList = await utilities.buildClassificationList(req.body.classification_id)
  const {
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  } = req.body

  const result = await invModel.addInventoryItem(
    classification_id,
    inv_make,
    inv_model,
    inv_year,
    inv_description,
    inv_image,
    inv_thumbnail,
    inv_price,
    inv_miles,
    inv_color
  )

  if (result) {
    req.flash("notice", "Vehicle successfully added!")
    nav = await utilities.getNav()
    const classificationSelect = await utilities.buildClassificationList() // ✅ ADD THIS LINE
    res.status(201).render("./inventory/management", {
      title: "Inventory Management",
      nav,
      notice: req.flash("notice"),
      classificationSelect // ✅ PASS THIS TO THE VIEW
    })
  } else {
    req.flash("notice", "Failed to add vehicle.")
    res.status(500).render("./inventory/add-inventory", {
      title: "Add New Inventory",
      nav,
      classificationList,
      errors: null,
      notice: req.flash("notice"),
      ...req.body
    })
  }
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
// In your invController.js


invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}

module.exports = invCont;







module.exports = invCont;