const express = require("express");
const router = express.Router();

const { sql, poolPromise } = require("../db");
/* ===============================
   FORM GROUPS
================================*/
router.get("/form-groups", async (req, res) => {
  try {
    const pool = await poolPromise;
    const result = await pool.request().query(`
      SELECT DISTINCT FormGroupCode FROM Forms
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("FORM GROUP ERROR:", err.message);
    res.status(500).send(err.message);
  }
});
 
/* ===============================
   USER GROUPS (FOR DROPDOWN)
================================*/
router.get("/user-groups", async (req, res) => {
  try {
    const pool = await poolPromise;
 
    const result = await pool.request().query(`
      SELECT
        UserGroupCode,
        UserGroupName
      FROM UserGroupMaster
      WHERE isActive = 1
      ORDER BY UserGroupCode
    `);
 
    res.json(result.recordset);
 
  } catch (err) {
    console.error("USER GROUP ERROR:", err.message);
    res.status(500).send(err.message);
  }
});
 
 // ==============================
// 🔥 GET FORM GROUPS
// ==============================
// router.get("/form-groups", async (req, res) => {
//   try {
//     const pool = await poolPromise;
 
//     const result = await pool.request().query(`
//       SELECT DISTINCT FormGroupCode
//       FROM Forms
//       ORDER BY FormGroupCode
//     `);
 
//     res.json(result.recordset);
 
//   } catch (err) {
//     console.error(err);
//     res.status(500).send(err.message);
//   }
// });
 
 
/* ===============================
   GET PERMISSIONS
================================*/
router.get("/permissions/:groupCode", async (req, res) => {
  try {
    const pool = await poolPromise;
 
    const result = await pool.request()
      .input("groupCode", sql.VarChar, req.params.groupCode)
      .input(
        "formGroupCode",
        sql.VarChar,
        req.query.formGroupCode || null
      )
      .query(`
SELECT
  u.UserGroupCode,
  RTRIM(LTRIM(f.FormGroupCode)) AS FormGroupCode,
  f.FormCode,
  f.FormDescription,
  u.AllowRead
  // CASE
  //    WHEN u.AllowRead = R THEN 1
  //   ELSE 0
  // END AS AllowRead
FROM UserPermission u
INNER JOIN Forms f
  ON u.FormCode = f.FormCode
WHERE
  u.UserGroupCode = @groupCode
AND (
  @formGroupCode IS NULL
  OR @formGroupCode = ''
  OR RTRIM(LTRIM(f.FormGroupCode)) = RTRIM(LTRIM(@formGroupCode))
)
`)
 
    res.json(result.recordset);
 
  } catch (err) {
    console.error(err);
    res.status(500).send(err.message);
  }
});
/* ===============================
   UPDATE PERMISSIONS 🔥
================================*/
router.post("/permissions/update", async (req, res) => {
  try {
    const pool = await poolPromise;
 
    const { userGroup, data } = req.body;
 
    for (const item of data) {
 
      // check exist
      const check = await pool.request()
        .input("group", sql.VarChar, userGroup)
        .input("form", sql.VarChar, item.formCode)
        .query(`
          SELECT * FROM UserPermission
          WHERE UserGroupCode = @group
          AND FormCode = @form
        `);
 
      if (check.recordset.length > 0) {
        // UPDATE
        await pool.request()
          .input("group", sql.VarChar, userGroup)
          .input("form", sql.VarChar, item.formCode)
          .input("allow", sql.VarChar, item.allow ? 1 : 0)   // ✅ FIX
          .query(`
            UPDATE UserPermission
  SET
    AllowRead = CASE WHEN @allow = 1 THEN 'R' ELSE 'N' END,
    AllowAdd = CASE WHEN @allow = 1 THEN 'A' ELSE 'N' END,
    AllowUpdate = CASE WHEN @allow = 1 THEN 'U' ELSE 'N' END,
    AllowDelete = CASE WHEN @allow = 1 THEN 'D' ELSE 'N' END
  WHERE UserGroupCode = @group
  AND FormCode = @form
`)
      } else {
        // INSERT
        await pool.request()
          .input("group", sql.VarChar, userGroup)
          .input("form", sql.VarChar, item.formCode)
          .input("allow", sql.Bit, item.allow ? 1 : 0)
          .query(`
            INSERT INTO UserPermission
            (UserGroupCode, FormCode, AllowRead)
            VALUES
            (@group, @form, @allow)
          `);
      }
    }
 
    res.json({ message: "Permissions Updated" });
 
  } catch (err) {
    console.error("PERMISSION UPDATE ERROR:", err.message);
    res.status(500).send(err.message);
  }
});
module.exports = router;
 