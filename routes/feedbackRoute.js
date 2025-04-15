const express = require('express');
const { feedbackRules, checkFeedbackData } = require('../utilities/feedback-validation');
const feedbackController = require('../controllers/feedbackController');
const utilities = require('../utilities');  // This is your utility import for checkLogin

const router = express.Router();

// Only logged-in users can access the feedback page
router.get('/feedback', utilities.checkLogin, feedbackController.showFeedbackForm);

// POST route for feedback submission with validation and error handling
router.post('/feedback',
  utilities.checkLogin,         // Ensure user is logged in
  feedbackRules(),              // Apply validation rules
  checkFeedbackData,            // Handle validation errors
  feedbackController.submitFeedback  // Submit feedback if validation passes
);

// ✅ Admin-only route to view all feedbacks
router.get('/feedbacks', utilities.checkLogin, utilities.adminType, feedbackController.viewFeedback);


module.exports = router;

