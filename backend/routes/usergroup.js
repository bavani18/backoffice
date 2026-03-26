const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db");


// 🔥 GET ALL USER GROUPS
router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .query(`
        SELECT 
          UserGroupId,
          UserGroupCode,
          UserGroupName,
          isActive,
          Createddate,
          ModifyDate
        FROM UserGroupMaster
        WHERE isActive = 1
        ORDER BY Createddate DESC
      `);

    res.json(result.recordset);

  } catch (err) {
    res.status(500).send(err.message);
  }
});


// 🔥 GET BY CODE
router.get("/:code", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input("code", sql.VarChar, req.params.code)
      .query(`
        SELECT * FROM UserGroupMaster 
        WHERE UserGroupCode = @code
      `);

    res.json(result.recordset[0]);

  } catch (err) {
    res.status(500).send(err.message);
  }
});


// 🔥 CREATE (POST)
router.post("/", async (req, res) => {
  try {
    // ✅ FIXED NAMES
    const { userGroupCode, userGroupName, isActive } = req.body;

    const pool = await poolPromise;

    // 🔍 duplicate check
    const check = await pool.request()
      .input("code", sql.VarChar, userGroupCode)
      .query("SELECT * FROM UserGroupMaster WHERE UserGroupCode=@code");

    if (check.recordset.length > 0) {
      return res.status(400).send("Code already exists ❌");
    }

    await pool.request()
      .input("id", sql.UniqueIdentifier, sql.UniqueIdentifier().generate())
      .input("code", sql.VarChar, userGroupCode)
      .input("name", sql.VarChar, userGroupName)
      .input("isActive", sql.Bit, isActive)
      .query(`
        INSERT INTO UserGroupMaster 
        (UserGroupId, UserGroupCode, UserGroupName, isActive)
        VALUES (@id, @code, @name, @isActive)
      `);

    res.send("Created Successfully ✅");

  } catch (err) {
    res.status(500).send(err.message);
  }
});


// 🔥 UPDATE (PUT)
router.put("/:id", async (req, res) => {
  try {
    // ✅ FIXED NAMES
    const { userGroupName, isActive } = req.body;

    const pool = await poolPromise;

    await pool.request()
      .input("id", sql.UniqueIdentifier, req.params.id)
      .input("name", sql.VarChar, userGroupName)
      .input("isActive", sql.Bit, isActive)
      .query(`
        UPDATE UserGroupMaster
        SET UserGroupName=@name,
            isActive=@isActive,
            ModifyDate = GETDATE()
        WHERE UserGroupId=@id
      `);

    res.send("Updated Successfully ✅");

  } catch (err) {
    res.status(500).send(err.message);
  }
});


// 🔥 DELETE (better use ID)
router.delete("/:id", async (req, res) => {
  try {
    const pool = await poolPromise;

    await pool.request()
      .input("id", sql.UniqueIdentifier, req.params.id)
      .query(`
        DELETE FROM UserGroupMaster
        WHERE UserGroupId=@id
      `);

    res.send("Deleted Successfully ✅");

  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;