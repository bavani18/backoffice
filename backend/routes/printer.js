const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db");


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


// 🔹 GET BY ID (FULL DETAILS)
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
          PM.KitchenTypeName,
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
          AND PS.FieldName = 'PrintSection'
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
      PrinterId,
      PrinterName,
      PrinterPath,
      PrinterIP,
      PrinterType,
      PrintSection,
      KitchenTypeName,
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
      .input("KitchenTypeName", sql.VarChar, KitchenTypeName)
      .input("KitchenTypeValue", sql.VarChar, KitchenTypeValue)
      .input("IsActive", sql.Bit, IsActive)
      .input("PrintCopy", sql.Int, PrintCopy)
      .query(`
        INSERT INTO PrintMaster (
          PrinterId, PrinterName, PrinterPath, PrinterIP,
          PrinterType, PrintSection,
          KitchenTypeName, KitchenTypeValue,
          IsActive, PrintCopy
        )
        VALUES (
          @PrinterId, @PrinterName, @PrinterPath, @PrinterIP,
          @PrinterType, @PrintSection,
          @KitchenTypeName, @KitchenTypeValue,
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
      KitchenTypeName,
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
      .input("KitchenTypeName", sql.VarChar, KitchenTypeName)
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
          KitchenTypeName = @KitchenTypeName,
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