const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require("../db");
const { v4: uuidv4 } = require("uuid");
 
/* ===============================
   GET ALL USERS
================================*/
router.get("/usermaster", async (req, res) => {
  try {
    const pool = await poolPromise;
 
    const result = await pool.request().query(`
      SELECT
        UserId,
        UserCode,
        UserName,
        UserGroupid AS UserGroupId
      FROM dbo.UserMaster
    `);
 
    res.json(result.recordset);
 
  } catch (err) {
    console.error("GET USER ERROR:", err.message);
    res.status(500).send(err.message);
  }
});
 
 
/* ===============================
   GET SINGLE USER
================================*/
router.get("/usermaster/:code", async (req, res) => {
  try {
    const pool = await poolPromise;
 
    const result = await pool.request()
      .input("code", sql.VarChar, req.params.code)
      .query(`
  SELECT
    UserId,
    UserCode,
    UserName,
    UserPassword,
    UserGroupid AS UserGroupId,  
    FirstName,
    LastName,
    FullName,
    NickName,
    IdentificationNo,
    CardNumber,
    isWaiter,
    IsDisabled
  FROM UserMaster
  WHERE UserCode = @code
`)
 
    res.json(result.recordset[0]);
 
  } catch (err) {
    console.error("GET SINGLE USER ERROR:", err.message);
    res.status(500).send(err.message);
  }
});
 
 
/* ===============================
   INSERT OR UPDATE (FIXED 🔥)
================================*/
router.post("/usermaster", async (req, res) => {
  try {
    const pool = await poolPromise;
 
    const {
      UserId,   // 🔥 IMPORTANT
      UserCode, UserName, UserPassword, UserGroupId,
      FirstName, LastName, FullName, NickName,
      IdentificationNo, CardNumber, isWaiter, IsDisabled
    } = req.body;
 
    // ✅ UPDATE (USING USERID)
    if (UserId) {
      await pool.request()
        .input("UserId", sql.UniqueIdentifier, UserId)
        .input("UserCode", sql.VarChar, UserCode)
        .input("UserName", sql.VarChar, UserName)
        .input("UserPassword", sql.VarChar, UserPassword)
        .input("UserGroupId", sql.VarChar, UserGroupId)
        .input("FirstName", sql.VarChar, FirstName)
        .input("LastName", sql.VarChar, LastName)
        .input("FullName", sql.VarChar, FullName)
        .input("NickName", sql.VarChar, NickName)
        .input("IdentificationNo", sql.VarChar, IdentificationNo)
        .input("CardNumber", sql.VarChar, CardNumber)
        .input("isWaiter", sql.Bit, isWaiter)
        .input("IsDisabled", sql.Bit, IsDisabled)
        .query(`
          UPDATE UserMaster SET
            UserCode=@UserCode,
            UserName=@UserName,
            UserPassword=@UserPassword,
            UserGroupid=@UserGroupId,
            FirstName=@FirstName,
            LastName=@LastName,
            FullName=@FullName,
            NickName=@NickName,
            IdentificationNo=@IdentificationNo,
            CardNumber=@CardNumber,
            isWaiter=@isWaiter,
            IsDisabled=@IsDisabled
          WHERE UserId=@UserId
        `);
 
      return res.json({ message: "User Updated" });
    }
 
    // ✅ INSERT
    await pool.request()
      .input("UserId", sql.UniqueIdentifier, uuidv4())
      .input("UserCode", sql.VarChar, UserCode)
      .input("UserName", sql.VarChar, UserName)
      .input("UserPassword", sql.VarChar, UserPassword)
      .input("UserGroupId", sql.VarChar, UserGroupId)
      .input("FirstName", sql.VarChar, FirstName)
      .input("LastName", sql.VarChar, LastName)
      .input("FullName", sql.VarChar, FullName)
      .input("NickName", sql.VarChar, NickName)
      .input("IdentificationNo", sql.VarChar, IdentificationNo)
      .input("CardNumber", sql.VarChar, CardNumber)
      .input("isWaiter", sql.Bit, isWaiter)
      .input("IsDisabled", sql.Bit, IsDisabled)
      .query(`
        INSERT INTO UserMaster
        (
          UserId,UserCode,UserName,UserPassword,UserGroupId,
          FirstName,LastName,FullName,NickName,
          IdentificationNo,CardNumber,isWaiter,IsDisabled
        )
        VALUES
        (
          @UserId,@UserCode,@UserName,@UserPassword,@UserGroupId,
          @FirstName,@LastName,@FullName,@NickName,
          @IdentificationNo,@CardNumber,@isWaiter,@IsDisabled
        )
      `);
 
    res.json({ message: "User Created" });
 
  } catch (err) {
    console.error("SAVE USER ERROR:", err.message);
    res.status(500).send(err.message);
  }
});
 
 
/* ===============================
   DELETE USER
================================*/
router.delete("/usermaster/:code", async (req, res) => {
  try {
    const pool = await poolPromise;
 
    await pool.request()
      .input("code", sql.VarChar, req.params.code)
      .query(`DELETE FROM UserMaster WHERE UserCode = @code`);
 
    res.json({ message: "User Deleted" });
 
  } catch (err) {
    console.error("DELETE USER ERROR:", err.message);
    res.status(500).send(err.message);
  }
});
 
module.exports = router;
 