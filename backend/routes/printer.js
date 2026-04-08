const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db");
const { v4: uuidv4 } = require("uuid");

// 🔹 GET ALL PRINTERS
router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT 
        PrinterId,
        PrinterName,
        PrinterIP,
        IsActive
      FROM PrintMaster
      ORDER BY PrinterName
    `);

    res.json(result.recordset);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// 🔥 ================= IMPORTANT CHANGE =================

// ✅ FIRST → dropdown APIs
router.get("/printer-type", async (req, res) => {
  const pool = await poolPromise;

  const result = await pool.request().query(`
    SELECT PickListNumber, PickListValue
    FROM PickListMaster
    WHERE TableName = 'PrintMaster'
    AND FieldName = 'PrinterType'
    ORDER BY DisplayOrder
  `);

  res.json(result.recordset);
});

router.get("/print-section", async (req, res) => {
  const pool = await poolPromise;

  const result = await pool.request().query(`
    SELECT PickListNumber, PickListValue
    FROM PickListMaster
    WHERE TableName = 'PrintMaster'
    AND FieldName = 'PrintSection'
    ORDER BY DisplayOrder
  `);

  res.json(result.recordset);
});

router.get("/kitchen-type", async (req, res) => {
  const pool = await poolPromise;

  const result = await pool.request().query(`
    SELECT PickListNumber, PickListValue
    FROM PickListMaster
    WHERE TableName = 'DishMaster'
    AND FieldName = 'KitchenType'
    ORDER BY DisplayOrder
  `);

  res.json(result.recordset);
});


// 🔹 GET BY ID (FULL DETAILS) 🔥 NOW MOVED DOWN
router.get("/:id", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input("id", sql.VarChar, req.params.id)
      .query(`
        SELECT 
          PM.PrinterId,
          PM.PrinterName,
          PM.PrinterPath,
          PM.PrinterIP,
          PM.PrinterType,
          PT.PickListValue AS PrinterTypeName,
          PM.PrintSection,
          PS.PickListValue AS PrintSectionName,
          PM.KitchenTypeValue,
          PM.IsActive,
          PM.PrintCopy
        FROM PrintMaster PM

        LEFT JOIN PickListMaster PT 
          ON PT.TableName = 'PrintMaster' 
          AND PT.FieldName = 'PrinterType'
          AND PT.PickListNumber = PM.PrinterType

        LEFT JOIN PickListMaster PS 
          ON PS.TableName = 'PrintMaster' 
          AND PT.FieldName = 'PrintSection'
          AND PS.PickListNumber = PM.PrintSection

        WHERE PM.PrinterId = @id
      `);

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// 🔹 POST (CREATE)
router.post("/", async (req, res) => {
  try {
    const {
      PrinterName,
      PrinterPath,
      PrinterIP,
      PrinterType,
      PrintSection,
      KitchenTypeValue,
      IsActive,
      PrintCopy
    } = req.body;

    const pool = await poolPromise;

    await pool.request()
      .input("PrinterId", sql.VarChar, uuidv4()) 
      .input("PrinterName", sql.VarChar, PrinterName)
      .input("PrinterPath", sql.VarChar, PrinterPath)
      .input("PrinterIP", sql.VarChar, PrinterIP)
      .input("PrinterType", sql.Int, PrinterType)
      .input("PrintSection", sql.Int, PrintSection)
      .input("KitchenTypeValue", sql.VarChar, KitchenTypeValue)
      .input("IsActive", sql.Bit, IsActive)
      .input("PrintCopy", sql.Int, PrintCopy)
      .query(`
        INSERT INTO PrintMaster (
          PrinterId, PrinterName, PrinterPath, PrinterIP,
          PrinterType, PrintSection,
          KitchenTypeValue,
          IsActive, PrintCopy
        )
        VALUES (
          @PrinterId, @PrinterName, @PrinterPath, @PrinterIP,
          @PrinterType, @PrintSection,
          @KitchenTypeValue,
          @IsActive, @PrintCopy
        )
      `);

    res.send("✅ Created Successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// 🔹 PUT (UPDATE)
router.put("/:id", async (req, res) => {
  try {
    const {
      PrinterName,
      PrinterPath,
      PrinterIP,
      PrinterType,
      PrintSection,
      KitchenTypeValue,
      IsActive,
      PrintCopy
    } = req.body;

    const pool = await poolPromise;

    await pool.request()
      .input("PrinterId", sql.VarChar, req.params.id)
      .input("PrinterName", sql.VarChar, PrinterName)
      .input("PrinterPath", sql.VarChar, PrinterPath)
      .input("PrinterIP", sql.VarChar, PrinterIP)
      .input("PrinterType", sql.Int, PrinterType)
      .input("PrintSection", sql.Int, PrintSection)
      .input("KitchenTypeValue", sql.VarChar, KitchenTypeValue)
      .input("IsActive", sql.Bit, IsActive)
      .input("PrintCopy", sql.Int, PrintCopy)
      .query(`
        UPDATE PrintMaster SET
          PrinterName = @PrinterName,
          PrinterPath = @PrinterPath,
          PrinterIP = @PrinterIP,
          PrinterType = @PrinterType,
          PrintSection = @PrintSection,
          KitchenTypeValue = @KitchenTypeValue,
          IsActive = @IsActive,
          PrintCopy = @PrintCopy
        WHERE PrinterId = @PrinterId
      `);

    res.send("✅ Updated Successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// 🔹 DELETE
router.delete("/:id", async (req, res) => {
  try {
    const pool = await poolPromise;

    await pool.request()
      .input("PrinterId", sql.VarChar, req.params.id)
      .query(`
        DELETE FROM PrintMaster
        WHERE PrinterId = @PrinterId
      `);

    res.send("✅ Deleted Successfully");
  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;