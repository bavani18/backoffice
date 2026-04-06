const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db");
 
// CHANGE PASSWORD
router.post("/", async (req, res) => {
  try {
    console.log("BODY:", req.body);
 
    const { userId, oldPassword, newPassword } = req.body;
 
    if (!userId || !oldPassword || !newPassword) {
      return res.status(400).send("Missing fields");
    }
 
    const pool = await poolPromise;
 
    // 🔍 GET PASSWORD USING USERID (GUID)
    const result = await pool.request()
      .input("userId", sql.UniqueIdentifier, userId)
      .query(`
        SELECT UserPassword
        FROM UserMaster
        WHERE UserId = @userId
      `);
 
    if (result.recordset.length === 0) {
      return res.status(404).send("User not found");
    }
 
    const dbPassword = result.recordset[0].UserPassword;
 
    // 🔥 DECODE BASE64 PASSWORD
    const decodedPassword = Buffer.from(dbPassword, "base64").toString("utf-8");
 
    // ❌ CHECK OLD PASSWORD
    if (decodedPassword !== oldPassword) {
      return res.status(400).send("Old password incorrect");
    }
 
    // 🔥 ENCODE NEW PASSWORD
    const encodedNewPassword = Buffer.from(newPassword).toString("base64");
 
    // ✅ UPDATE PASSWORD
    await pool.request()
      .input("userId", sql.UniqueIdentifier, userId)
      .input("newPassword", sql.VarChar, encodedNewPassword)
      .query(`
        UPDATE UserMaster
        SET UserPassword = @newPassword
        WHERE UserId = @userId
      `);
 
    res.send("Password updated successfully ✅");
 
  } catch (err) {
    console.error("CHANGE PASSWORD ERROR:", err.message);
    res.status(500).send(err.message);
  }
});
 
module.exports = router;
 