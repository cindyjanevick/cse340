// feedback-validation.js
const { body, validationResult } = require('express-validator');
const Util = require('../utilities');

// Only validate the feedback message field
const feedbackRules = () => {
  return [
    body('message')
      .trim()
      .notEmpty().withMessage('Feedback message is required.')
      .isLength({ min: 10 }).withMessage('Feedback message must be at least 10 characters long.')
  ];
};

const checkFeedbackData = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const nav = await Util.getNav();
    const accountData = res.locals.accountData || {};
    
    return res.render('feedback', {
      title: 'Customer Feedback',
      nav,
      errors: errors.array(),
      customer_name: req.body.customer_name,
      email: req.body.email,
      message: req.body.message,
      flash: {
        success: req.flash('success'),
        error: req.flash('error')
      }
    });
  }
  next();
};

module.exports = { feedbackRules, checkFeedbackData };
