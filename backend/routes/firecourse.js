const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db");


// ================= 🔥 GET ALL =================
router.get("/", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .query(`
        SELECT FireCourseId, FireCourseCode, FireCourseName 
        FROM FireCourse
      `);

    res.json(result.recordset);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});


// ================= 🔹 GET BY ID =================
router.get("/:id", async (req, res) => {
  try {
    const pool = await poolPromise;

    const result = await pool.request()
      .input("id", sql.VarChar, req.params.id)
      .query(`
        SELECT FireCourseId, FireCourseCode, FireCourseName 
        FROM FireCourse 
        WHERE FireCourseId=@id
      `);

    res.json(result.recordset[0]);
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});


// ================= 🔹 INSERT / UPDATE =================
router.post("/save", async (req, res) => {
  const { id, code, name } = req.body;

  try {
    const pool = await poolPromise;

    if (id) {
      // UPDATE
      await pool.request()
        .input("id", sql.VarChar, id)
        .input("code", sql.VarChar, code)
        .input("name", sql.VarChar, name)
        .query(`
          UPDATE FireCourse 
          SET FireCourseCode=@code, 
              FireCourseName=@name
          WHERE FireCourseId=@id
        `);
    } else {
      // INSERT
      await pool.request()
        .input("code", sql.VarChar, code)
        .input("name", sql.VarChar, name)
        .query(`
          INSERT INTO FireCourse (FireCourseCode, FireCourseName)
          VALUES (@code, @name)
        `);
    }

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;