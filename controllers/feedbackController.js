// controllers/feedbackController.js
const feedbackModel = require('../models/feedback-model');
const { validationResult } = require('express-validator');
const Util = require('../utilities'); // For example, getNav()

/**
 * Renders the feedback form view.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const showFeedbackForm = async (req, res) => {
    const accountData = res.locals.accountData || {};
    const nav = await Util.getNav();
    
    const flashMessages = {
        success: req.flash('success'),
        error: req.flash('error')
    };

    // Pass the 'nav' variable to the view



    res.render('feedback', {
      title: 'Customer Feedback',
      nav,
      errors: [],
      customer_name: `${accountData.account_firstname || ''} ${accountData.account_lastname || ''}`.trim(),
      email: accountData.account_email || '',
      message: '', // 🔑 this was missing!
      flash: {
        flashMessages
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
      const nav = await Util.getNav(); // 🔑 ensure this is included
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
      req.flash('success', 'Thank you for your feedback!');
      res.redirect('/feedback');
    } catch (error) {
      console.error("Feedback submission failed:", error);
      req.flash('error', 'Error submitting feedback. Please try again.');
      res.redirect('/feedback');
    }
  };
  
  

/**
 * Renders the admin view with all feedback.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const viewFeedback = async (req, res) => {
    try {
        const feedbacks = await feedbackModel.getAllFeedback();
        console.log('Feedbacks:', feedbacks); // Log feedback data to verify
        res.render('admin/feedbacks', { title: 'Feedbacks', feedbacks });
    } catch (error) {
        console.error("Error fetching feedbacks:", error);  // Log the error
        req.flash('error', 'Unable to retrieve feedbacks.');
        res.redirect('/');
    }
};

module.exports = { showFeedbackForm, submitFeedback, viewFeedback };
