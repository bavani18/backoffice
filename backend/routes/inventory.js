const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db");


// ================== 🔍 GET ALL ==================
router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .query("SELECT * FROM InventoryMaster ORDER BY CreatedOn DESC");

    res.json(result.recordset);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================== 🔍 GET BY ID ==================
router.get("/:id", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input("id", sql.UniqueIdentifier, req.params.id)
      .query("SELECT * FROM InventoryMaster WHERE InventoryId=@id");

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================== ➕ CREATE ==================
router.post("/", async (req, res) => {
  try {
    const pool = await poolPromise;

    const { InventoryCode, Description, Price } = req.body;

    await pool.request()
      .input("InventoryId", sql.UniqueIdentifier, require("crypto").randomUUID())
      .input("InventoryCode", sql.VarChar, InventoryCode)
      .input("Description", sql.VarChar, Description)
      .input("Price", sql.Decimal(18,2), Price)
      .query(`
        INSERT INTO InventoryMaster (InventoryId, InventoryCode, Description, Price, CreatedOn)
        VALUES (@InventoryId, @InventoryCode, @Description, @Price, GETDATE())
      `);

    res.json({ message: "✅ Created successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================== ✏️ UPDATE ==================
router.put("/:id", async (req, res) => {
  try {
    const pool = await poolPromise;

    const { Description, Price } = req.body;

    await pool.request()
      .input("id", sql.UniqueIdentifier, req.params.id)
      .input("Description", sql.VarChar, Description)
      .input("Price", sql.Decimal(18,2), Price)
      .query(`
        UPDATE InventoryMaster
        SET Description=@Description,
            Price=@Price
        WHERE InventoryId=@id
      `);

    res.json({ message: "✅ Updated successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ================== ❌ DELETE ==================
router.delete("/:id", async (req, res) => {
  try {
    const pool = await poolPromise;

    await pool.request()
      .input("id", sql.UniqueIdentifier, req.params.id)
      .query("DELETE FROM InventoryMaster WHERE InventoryId=@id");

    res.json({ message: "🗑️ Deleted successfully" });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;