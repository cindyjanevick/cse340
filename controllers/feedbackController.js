// controllers/feedbackController.js
const feedbackModel = require('../models/feedback-model');
const { validationResult } = require('express-validator');
const Util = require('../utilities'); // 👈 Add this


/**
 * @module feedbackController
 */

/**
 * Renders the feedback form view.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const showFeedbackForm = async (req, res) => {
    const accountData = res.locals.accountData || {};
    const nav = await Util.getNav(); // ✅ Works now

    res.render('feedback', {
        title: 'Customer Feedback',
        nav,
        errors: [],
        customer_name: `${accountData.account_firstname || ''} ${accountData.account_lastname || ''}`,
        email: accountData.account_email || '',
        flash: req.flash()
    });
};


/**
 * Handles feedback submission.
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 */
const submitFeedback = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.render('feedback', {
            title: 'Customer Feedback',
            errors: errors.array(),
            customer_name: req.body.customer_name,
            email: req.body.email,
            flash: {}
        });
    }

    try {
        const feedback = {
            customer_name: req.body.customer_name,
            email: req.body.email,
            message: req.body.message,
        };
        console.log("Trying to insert feedback:", feedback); // DEBUG


        await feedbackModel.addFeedback(feedback);
        req.flash('success', 'Thank you for your feedback!');
        res.redirect('/feedback');
    } catch (error) {

        console.error("Feedback submission failed:", error); // DEBUG

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
        res.render('admin/feedbacks', { title: 'Feedbacks', feedbacks });
    } catch (error) {
        req.flash('error', 'Unable to retrieve feedbacks.');
        res.redirect('/');
    }
};

module.exports = { showFeedbackForm, submitFeedback, viewFeedback };
