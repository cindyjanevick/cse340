const feedbackModel = require('../models/feedback-model');
const { validationResult } = require('express-validator');
const utilities = require("../utilities/")
/**
 * Renders the feedback form view.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const showFeedbackForm = async (req, res) => {
    const accountData = res.locals.accountData || {};
    const nav = await Util.getNav();
    
    // Directly pass success/error messages to the view
    const successMessage = req.flash('success');
    const errorMessage = req.flash('error');

    res.render('feedback', {
      title: 'Customer Feedback',
      nav,
      errors: [],
      customer_name: `${accountData.account_firstname || ''} ${accountData.account_lastname || ''}`.trim(),
      email: accountData.account_email || '',
      message: '', // Initial empty message
      flash: {
        success: successMessage,
        error: errorMessage
      }
    });
};

/**
 * Handles feedback submission.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const submitFeedback = async (req, res) => {
    const errors = validationResult(req);
    const { customer_name, email, message } = req.body;
  
    if (!errors.isEmpty()) {
      const nav = await Util.getNav(); // Ensure nav is included
      return res.render('feedback', {
        title: 'Customer Feedback',
        nav,
        errors: errors.array(),
        customer_name,
        email,
        message,
        flash: {
          success: req.flash('success'),
          error: req.flash('error')
        }
      });
    }
  
    try {
      await feedbackModel.addFeedback({ customer_name, email, message });
      
      // Set the flash message for success
      req.flash('success', 'Thank you for your feedback!');
      
      // Redirect to /feedback page to show the success message
      return res.redirect('/feedback');
    } catch (error) {
      console.error("Feedback submission failed:", error);
      
      // Set the flash message for failure
      req.flash('error', 'Error submitting feedback. Please try again.');
      
      // Redirect back to the feedback form
      return res.redirect('/feedback');
    }
};

/**
 * Renders the admin view with all feedback.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const viewFeedback = async (req, res) => {
    try {
        const nav = await utilities.getNav();
        const feedbacks = await feedbackModel.getAllFeedback();
        console.log('Feedbacks:', feedbacks); // Log feedback data to verify
        res.render('admin/feedbacks', {
             title: 'Feedbacks',
             
             nav,
             feedbacks,

        });
           
    } catch (error) {
        console.error("Error fetching feedbacks:", error);  // Log the error
        req.flash('error', 'Unable to retrieve feedbacks.');
        res.redirect('/');
    }
};

module.exports = { showFeedbackForm, submitFeedback, viewFeedback };
