const express = require("express");
const router = express.Router();
 
// 🔥 IMPORTANT CHANGE
const { sql, poolPromise } = require("../db");
 
 
// 🔹 GET all price lists
router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise; // ✅ FIX
 
    const result = await pool.request().query(`
      SELECT PriceListId, Name, Description, SortCode, IsActive
      FROM PriceListMaster
      ORDER BY SortCode, Name
    `);
 
    res.json(result.recordset);
 
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});
 
 
// 🔹 GET by ID
router.get("/:id", async (req, res) => {
  try {
    const pool = await poolPromise; // ✅ FIX
 
    const result = await pool.request()
      .input("id", sql.VarChar, req.params.id) // ✅ SAFE
      .query(`
        SELECT * FROM PriceListMaster
        WHERE PriceListId = @id
      `);
 
    res.json(result.recordset[0]);
 
  } catch (err) {
    res.status(500).send(err.message);
  }
});
 
 
// 🔹 CREATE / UPDATE
router.post("/", async (req, res) => {
  const {
    PriceListId,
    Name,
    Description,
    SortCode,
    IsActive,
    CreatedBy
  } = req.body;
 
  try {
    const pool = await poolPromise; // ✅ FIX
 
    await pool.request()
      .input("PriceListId", sql.VarChar, PriceListId)
      .input("Name", sql.VarChar, Name)
      .input("Description", sql.VarChar, Description)
      .input("SortCode", sql.Int, SortCode)
      .input("IsActive", sql.Bit, IsActive)
      .input("CreatedBy", sql.VarChar, CreatedBy)
      .query(`
        MERGE PriceListMaster AS target
        USING (SELECT @PriceListId AS PriceListId) AS source
        ON target.PriceListId = source.PriceListId
 
        WHEN MATCHED THEN
          UPDATE SET
            Name = @Name,
            Description = @Description,
            SortCode = @SortCode,
            IsActive = @IsActive
 
        WHEN NOT MATCHED THEN
          INSERT (
            PriceListId, Name, Description, SortCode, IsActive,
            CreatedDate, ExpiryDate, CreatedBy
          )
          VALUES (
            @PriceListId,
            @Name,
            @Description,
            @SortCode,
            @IsActive,
            GETDATE(),
            DATEADD(YEAR, 2, GETDATE()),
            @CreatedBy
          );
      `);
 
    res.send("✅ Saved successfully");
 
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});
 
module.exports = router;
 