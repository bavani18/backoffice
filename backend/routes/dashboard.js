const express = require("express");
const router = express.Router();
const db = require("../db");

// GET DASHBOARD DATA
router.get("/dashboard", (req, res) => {

  const query = `
    SELECT 
      (SELECT COUNT(*) FROM kitchen) AS kitchen_total,
      (SELECT COUNT(*) FROM kitchen WHERE active=1) AS kitchen_active,
      (SELECT COUNT(*) FROM kitchen WHERE active=0) AS kitchen_inactive,

      (SELECT COUNT(*) FROM CategoryMaster) AS category_total,
      (SELECT COUNT(*) FROM CategoryMaster WHERE active=1) AS category_active,
      (SELECT COUNT(*) FROM CategoryMaster WHERE active=0) AS category_inactive,

      (SELECT COUNT(*) FROM dishgroupmaster) AS dishgroup_total,
      (SELECT COUNT(*) FROM dishgroupmaster WHERE active=1) AS dishgroup_active,
      (SELECT COUNT(*) FROM dishgroupmaster WHERE active=0) AS dishgroup_inactive,

      (SELECT COUNT(*) FROM dishmaster) AS dish_total,
      (SELECT COUNT(*) FROM dishmaster WHERE active=1) AS dish_active,
      (SELECT COUNT(*) FROM dishmaster WHERE active=0) AS dish_inactive
  `;

  db.query(query, (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "Database error" });
    }

    res.json(result[0]);
  });
});

module.exports = router;