const jwt = require("jsonwebtoken");
require("dotenv").config();
const invModel = require("../models/inventory-model");
const accModel = require("../models/account-model");
const Util = {}

/* ************************
 * Constructs the nav HTML unordered list
 ************************** */
Util.getNav = async function (req, res, next) {
  let data = await invModel.getClassifications()
  console.log(data);
  let list = "<ul>"
  list += '<li><a href="/" title="Home page">Home</a></li>'
  data.rows.forEach((row) => {
    list += "<li>"
    list +=
      '<a href="/inv/type/' +
      row.classification_id +
      '" title="See our inventory of ' +
      row.classification_name +
      ' vehicles">' +
      row.classification_name +
      "</a>"
    list += "</li>"
  })
  list += "</ul>"
  return list
}



Util.buildClassificationList = async function (classification_id = null) {
  let data = await invModel.getClassifications()
  let classificationList =
    '<select name="classification_id" id="classificationList" required>'
  classificationList += "<option value=''>Choose a Classification</option>"
  data.rows.forEach((row) => {
    classificationList += '<option value="' + row.classification_id + '"'
    if (
      classification_id != null &&
      row.classification_id == classification_id
    ) {
      classificationList += " selected "
    }
    classificationList += ">" + row.classification_name + "</option>"
  })
  classificationList += "</select>"
  return classificationList
}





/* **************************************
* Build the classification view HTML
* ************************************ */
Util.buildClassificationGrid = async function(data){
  let grid
  if(data.length > 0){
    grid = '<ul id="inv-display">'
    data.forEach(vehicle => { 
      grid += '<li>'
      grid +=  '<a href="../../inv/detail/'+ vehicle.inv_id 
      + '" title="View ' + vehicle.inv_make + ' '+ vehicle.inv_model 
      + 'details"><img src="' + vehicle.inv_thumbnail 
      +'" alt="Image of '+ vehicle.inv_make + ' ' + vehicle.inv_model 
      +' on CSE Motors" /></a>'
      grid += '<div class="namePrice">'
      grid += '<hr />'
      grid += '<h2>'
      grid += '<a href="../../inv/detail/' + vehicle.inv_id +'" title="View ' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + ' details">' 
      + vehicle.inv_make + ' ' + vehicle.inv_model + '</a>'
      grid += '</h2>'
      grid += '<span>$' 
      + new Intl.NumberFormat('en-US').format(vehicle.inv_price) + '</span>'
      grid += '</div>'
      grid += '</li>'
    })
    grid += '</ul>'
  } else { 
    grid += '<p class="notice">Sorry, no matching vehicles could be found.</p>'
  }
  return grid
}

/**
 * Build a single listing element from data
 */
Util.buildItemListing = async function (data) {
  let listingHTML = "";
  if (data) {
    listingHTML = `
      <h1>${data.inv_year} ${data.inv_make} ${data.inv_model}</h1>
      <section class="car-listing">
        <img src="${data.inv_image}" alt="${data.inv_make} ${data.inv_model}">
        <div class="car-information">
          <div>
            <h2>${data.inv_make} ${data.inv_model} Details</h2>
          </div>
          <div>
            <strong>Price:</strong> ${Number.parseFloat(data.inv_price).toLocaleString("en-US", {
              style: "currency",
              currency: "USD",
            })}
          </div>
          <div class="description">
            <p>
              <strong>Description:</strong> ${data.inv_description}
            </p>
            <p><strong>Color:</strong> ${data.inv_color}</p>
            <p><strong>Miles:</strong> ${data.inv_miles.toLocaleString("en-US")}</p>
          </div>
        </div>
      </section>
    `;
  } else {
    listingHTML = `
      <p>Sorry, no matching vehicles could be found.</p>
    `;
  }
  return listingHTML;
};

/* **************************************
 * Build the inventory item detail view
 ************************************** */
Util.buildItemDetailView = function (item) {
  if (!item) {
    return '<p class="notice">Vehicle details not found.</p>';
  }

  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });

  const milesFormatter = new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 0
  });

  let detailView = `
    <div class="vehicle-detail">
      <h1>${item.inv_make} ${item.inv_model}</h1>
      <div>
        <img src="${item.inv_image}" alt="Image of ${item.inv_make} ${item.inv_model}">
      </div>
      <div>
        <p><strong>Price:</strong> $${formatter.format(item.inv_price)}</p>
        <p><strong>Year:</strong> ${item.inv_year}</p>
        <p><strong>Make:</strong> ${item.inv_make}</p>
        <p><strong>Model:</strong> ${item.inv_model}</p>
        <p><strong>Mileage:</strong> ${milesFormatter.format(item.inv_miles)}</p>
        <p><strong>Description:</strong> ${item.inv_description}</p>
      </div>
    </div>
  `;
  console.log(item)
  return detailView;
};

// Util.buildClassificationList = async function (classification_id = null) {
//   let data = await invModel.getClassifications()
//   let classificationList =
//     '<select name="classification_id" id="classificationList" required>'
//   classificationList += "<option value=''>Choose a Classification</option>"
//   data.rows.forEach((row) => {
//     classificationList += '<option value="' + row.classification_id + '"'
//     if (
//       classification_id != null &&
//       row.classification_id == classification_id
//     ) {
//       classificationList += " selected "
//     }
//     classificationList += ">" + row.classification_name + "</option>"
//   })
//   classificationList += "</select>"
//   return classificationList
// }


















/* ****************************************
 * Middleware For Handling Errors
 * Wrap other function in this for 
 * General Error Handling
 **************************************** */
Util.handleErrors = fn => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)

/* ****************************************
 * Middleware to check token validity
 **************************************** */
Util.checkJWTToken = (req, res, next) => {
  if (req.cookies.jwt) {
    jwt.verify(
      req.cookies.jwt,
      process.env.ACCESS_TOKEN_SECRET,
      function (err, accountData) {
        if (err) {
          req.flash("Please log in");
          res.clearCookie("jwt");
          res.locals.accountData = null;
          res.locals.loggedin = 0;
          return res.redirect("/account/login");
        }
        res.locals.accountData = accountData;
        res.locals.loggedin = 1;
        next();
      }
    );
  } else {
    res.locals.accountData = null;
    res.locals.loggedin = 0;
    next();
  }
};


/************************
 * Build drop-down select list of mails.
 ********************/
Util.buildEmailList = async function (account_id = null) {
  let data = await accModel.getAccounts();
  let emailList = '<select name="account_id" id="emailList" required>';
  emailList += "<option value=''>Choose an Email</option>";
  data.rows.forEach((row) => {
    emailList += '<option value="' + row.account_id + '"';
    if (account_id != null && row.account_id == account_id) {
      emailList += " selected ";
    }
    emailList += ">" + row.account_email + "</option>";
  });
  emailList += "</select>";
  return emailList;
};


/* ****************************************
 *  Check Login
 * ************************************ */
Util.checkLogin = (req, res, next) => {
  if (res.locals.loggedin) {
    next();
  } else {
    req.flash("notice", "Please log in.");
    return res.redirect("/account/login");
  }
};


/******************************
 * Check account type
 **************************/
Util.accountType = (req, res, next) => {
  if (res.locals.accountData) {
    if (res.locals.accountData.account_type != "Client") {
      next();
    } else {
      req.flash("notice", "Access is forbidden.");
      return res.redirect("account");
    }
  } else {
    req.flash("notice", "You don't have the required account to access.");
    return res.redirect("/account/login");
  }
};


/******************************
 * Check account type of is Admin
 **************************/
Util.adminType = (req, res, next) => {
  if (res.locals.accountData) {
    console.log("Account Type:", res.locals.accountData.account_type);  // Add this log
    if (res.locals.accountData.account_type == "Admin") {
      next();
    } else {
      req.flash("notice", "Access is forbidden.");
      return res.redirect("/account/");
    }
  } else {
    req.flash("notice", "You don't have the required account to access.");
    return res.redirect("/account/login");
  }
};



module.exports = Util