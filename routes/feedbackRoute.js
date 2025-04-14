const express = require('express');
const { body } = require('express-validator');
const feedbackController = require('../controllers/feedbackController');
const utilities = require('../utilities');  // Assuming you have a utility for checking login status

const router = express.Router();

// Route to show the feedback form (only accessible if the user is logged in)
router.get('/feedback', utilities.checkLogin, feedbackController.showFeedbackForm);

// Route for submitting feedback (only accessible if the user is logged in)
router.post('/feedback', [
    body('customer_name').notEmpty().withMessage('Name is required.'),
    body('email').isEmail().withMessage('Invalid email.'),
    body('message').notEmpty().withMessage('Message is required.')
], feedbackController.submitFeedback);

// Route for admin to view all feedback (admin only)
router.get('/admin/feedbacks', feedbackController.viewFeedback);

module.exports = router;
