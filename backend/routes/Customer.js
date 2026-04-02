const express = require("express");
const router = express.Router();
const sql = require("mssql");
const poolPromise = require("../db");

// GET ALL
router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request().query(`
      SELECT CustomerId, CustomerCode, Name, ContactPerson
      FROM Customer
      ORDER BY Name
    `);

    res.json(result.recordset);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error");
  }
});

// INSERT / UPDATE
router.post("/", async (req, res) => {
  try {
    const {
      CustomerId,
      CustomerCode,
      Name,
      ContactPerson
    } = req.body;

    const pool = await poolPromise;

    let id = CustomerId || require("uuid").v4();

    const exists = await pool.request()
      .input("CustomerId", sql.UniqueIdentifier, id)
      .query("SELECT CustomerId FROM Customer WHERE CustomerId=@CustomerId");

    if (exists.recordset.length > 0) {
      // UPDATE
      await pool.request()
        .input("CustomerId", sql.UniqueIdentifier, id)
        .input("Name", sql.VarChar, Name)
        .input("ContactPerson", sql.VarChar, ContactPerson)
        .query(`
          UPDATE Customer
          SET Name=@Name, ContactPerson=@ContactPerson
          WHERE CustomerId=@CustomerId
        `);
    } else {
      // INSERT
      await pool.request()
        .input("CustomerId", sql.UniqueIdentifier, id)
        .input("CustomerCode", sql.VarChar, CustomerCode)
        .input("Name", sql.VarChar, Name)
        .input("ContactPerson", sql.VarChar, ContactPerson)
        .query(`
          INSERT INTO Customer (CustomerId, CustomerCode, Name, ContactPerson)
          VALUES (@CustomerId, @CustomerCode, @Name, @ContactPerson)
        `);
    }

    res.json({ message: "Saved", CustomerId: id });

  } catch (err) {
    console.log(err);
    res.status(500).send(err.message);
  }
});

module.exports = router;