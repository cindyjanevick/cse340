/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const session = require("express-session")
const pool = require("./database/")
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")
const baseController = require("./controllers/baseController")
const inventoryRoute = require("./routes/inventoryRoute")
// const intentionalErrorRoute = require("./routes/intentionalErrorRoute.js")
const utilities = require("./utilities/")

const accountRoute = require("./routes/accountRoute")
const bodyParser = require("body-parser")
const cookieParser = require("cookie-parser")
const feedbackRoute = require("./routes/feedbackRoute")
/* ***********************
 * Middleware
 * ************************/
app.use(session({
  store: new (require('connect-pg-simple')(session))({
    createTableIfMissing: true,
    pool,
  }),
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  name: 'sessionId',
}))
// Express Messages Middleware
app.use(require('connect-flash')());
app.use(function(req, res, next){
  res.locals.messages = require('express-messages')(req, res)
  next()
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded

//Unit 5, login activity
app.use(cookieParser());

//Unit5 Login process activity
app.use(utilities.checkJWTToken);






/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine","ejs")
app.use(expressLayouts)
app.set("layout","./layouts/layout")


/* ***********************
 * Routes
 *************************/

app.use(static)

// Index route
app.get("/", utilities.handleErrors(baseController.buildHome))

// //Inventory routes
// app.use("/inv", require("./routes/inventoryRoute"))
app.use("/inv", inventoryRoute)

console.log(accountRoute);

//Account route
app.use("/account", accountRoute);



// Feedback route (general form)
app.use(feedbackRoute);

// feedback Route
app.use('/admin',feedbackRoute);

// Intentional 500 Error Route for Testing
// app.use("/ierror", intentionalErrorRoute);

// File Not Found Route - must be last route in list
app.use(async (req, res, next) => {
  next({status: 404, message: 'Oops! It looks like we have lost the page.. Maybe it went on vacation?😅'})
})

/* ***********************
* Express Error Handler
* Place after all other middleware
*************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav()
  console.error(`Error at: "${req.originalUrl}": ${err.message}`)
  if(err.status == 404){ message = err.message} else {message = 'Oh no! There was a crash. Maybe try a different route?'}
  res.render("errors/error", {
    title: err.status || 'Server Error',
    message,
    nav
  })
})


/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})

