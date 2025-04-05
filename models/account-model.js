const pool = require("../database/")



/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
  }

  



/* **********************
 * Check for existing email (with account_id check)
 * ********************* */
async function checkExistingEmail(account_email, account_id){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1 AND account_id != $2";
    const email = await pool.query(sql, [account_email, account_id]);
    return email.rowCount > 0; // If another account exists with the same email
  } catch (error) {
    console.error(error.message);
    return false;
  }
}

/* *****************************
* Return account data using email address
* Unit 5, Login Activity
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

/* **************************************
* Update Account Data
* ************************************ */
async function updateAccount(account_firstname, account_lastname, account_email, account_id){
  try {
      const sql = `UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *`
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_id])
  } catch (error) {
      console.error("model error: " + error)
  }
}

/* **************************************
* Update Password Data
* ************************************ */
async function updatePassword(account_password, account_id){
  try {
      const sql = `UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *`
      return await pool.query(sql, [account_password, account_id])
  } catch (error) {
      console.error("model error: " + error)
  }
}

async function getAccountById(account_id){
  try {
      const result = await pool.query('SELECT * FROM account WHERE account_id = $1',
          [account_id])
      return result.rows[0]
  } catch (error) {
      return new Error("No matching email found")
  }
}




  module.exports ={registerAccount,checkExistingEmail,getAccountByEmail,updateAccount,updatePassword,getAccountById}