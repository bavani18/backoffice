const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db");

// ================= GET USER =================
router.post("/getUser", async (req, res) => {
  try {
    const { userName } = req.body;

    const pool = await poolPromise;

    const result = await pool.request()
      .input("UserName", sql.VarChar, userName)
      .query(`
        SELECT UserId, UserName, FullName, UserPassword
        FROM Vw_UserMaster
        WHERE UserName = @UserName
      `);

    if (result.recordset.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(result.recordset[0]);

  } catch (err) {
    console.error("❌ GET USER ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});


// ================= TIME ENTRY =================
router.post("/save", async (req, res) => {
  try {
    const { userId, status } = req.body;

    const pool = await poolPromise;

    await pool.request()
      .input("UserId", sql.VarChar, userId)
      .input("Status", sql.Int, status)
      .query(`
        INSERT INTO TimeEntry (UserId, EntryTime, Status)
        VALUES (@UserId, GETDATE(), @Status)
      `);

    res.json({ message: "✅ Time Entry Saved" });

  } catch (err) {
    console.error("❌ SAVE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;