const express = require("express");
const router = express.Router();
const { poolPromise } = require("../db");


// 🔥 GET STOCK (VB LOGIC)
router.get("/", async (req, res) => {

  try {
    const tranType = req.query.tranType; // PURORD / PURINV / PURRET

    const pool = await poolPromise;

    let query = `
      SELECT 
        TranId,
        TranNo,
        TranDate,
        TranType,
        SupplierName,
        NetAmount
      FROM PurchaseHeader
    `;

    // 👉 SAME VB FILTER
    if (tranType) {
      query += ` WHERE TranType='${tranType}'`;
    }

    query += ` ORDER BY TranNo DESC`;

    const result = await pool.request().query(query);

    res.json(result.recordset);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// 🔥 DELETE
router.delete("/:id", async (req, res) => {

  try {
    const pool = await poolPromise;

    await pool.request().query(`
      DELETE FROM PurchaseDetail WHERE TranId='${req.params.id}'
    `);

    await pool.request().query(`
      DELETE FROM PurchaseHeader WHERE TranId='${req.params.id}'
    `);

    res.json({ message: "Deleted" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;