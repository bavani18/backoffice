const express = require("express");
const router = express.Router();
const sql = require("mssql");

// DB config
const dbConfig = {
  user: "your_user",
  password: "your_password",
  server: "localhost",
  database: "your_db",
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

// 🔹 GET FireCourse by ID
router.get("/:id", async (req, res) => {
  try {
    await sql.connect(dbConfig);
    const result = await sql.query(
      `SELECT FireCourseId, FireCourseCode, FireCourseName 
       FROM FireCourse WHERE FireCourseId = '${req.params.id}'`
    );

    res.json(result.recordset[0]);
  } catch (err) {
    res.status(500).send("Server error");
  }
});

// 🔹 INSERT / UPDATE
router.post("/save", async (req, res) => {
  const { id, code, name, userId } = req.body;

  try {
    await sql.connect(dbConfig);

    if (id) {
      // UPDATE
      await sql.query(`
        UPDATE FireCourse 
        SET FireCourseCode='${code}', FireCourseName='${name}'
        WHERE FireCourseId='${id}'
      `);
    } else {
      // INSERT
      await sql.query(`
        INSERT INTO FireCourse (FireCourseCode, FireCourseName)
        VALUES ('${code}', '${name}')
      `);
    }

    res.json({ success: true });
  } catch (err) {
    console.log(err);
    res.status(500).send("Server error");
  }
});

module.exports = router;