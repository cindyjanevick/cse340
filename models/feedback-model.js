// models/feedbackModel.js
const pool = require("../database/");


/**
 * @module feedbackModel
 */

/**
 * Inserts new feedback into the database.
 
 */
async function addFeedback(feedback) {
    const query = `INSERT INTO feedback (customer_name, email, message) VALUES ($1, $2, $3) RETURNING *`;
    const values = [feedback.customer_name, feedback.email, feedback.message];
    try {
        const result = await pool.query(query, values);
        return result.rows[0];
    } catch (error) {
        throw new Error('Unable to add feedback: ' + error.message);
    }
}

/**
 * Retrieves all feedback from the database.
 * @returns {Promise<Array>} An array of feedback objects.
 */
async function getAllFeedback() {
    const query = 'SELECT * FROM feedback ORDER BY created_at DESC';
    try {
        const result = await pool.query(query);
        return result.rows;
    } catch (error) {
        throw new Error('Unable to retrieve feedback: ' + error.message);
    }
}

async function deleteFeedbackById(feedbackId) {
    try {
      const sql = 'DELETE FROM feedback WHERE feedback_id = $1';
      const result = await pool.query(sql, [feedbackId]);
      return result.rowCount > 0;
    } catch (error) {
      throw error;
    }
  }
  

module.exports = { addFeedback, getAllFeedback,deleteFeedbackById };
