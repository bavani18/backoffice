const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db");

router.get("/payment/:terminal/:userId", async (req, res) => {
  const { terminal, userId } = req.params;
  const pool = await poolPromise;

  const result = await pool.request()
    .input("terminal", sql.VarChar, terminal)
    .input("userId", sql.VarChar, userId)
    .query(`
      SELECT PaymodeName, SUM(SysAmount) AS SysAmount
      FROM PaymentDetail
      WHERE UserId = @userId 
      AND TerminalCode = @terminal
      AND isSettlement = 0
      GROUP BY PaymodeName
    `);

  res.json(result.recordset);
});

module.exports = router;