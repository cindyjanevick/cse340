const intentionalErrorController = {};

intentionalErrorController.causeError = async function(req, res, next) {
  console.log("Causing an intentional error...");
  // Deliberately throw an error
  throw new Error("This is an intentional 500 error.");
};

module.exports = intentionalErrorController;
