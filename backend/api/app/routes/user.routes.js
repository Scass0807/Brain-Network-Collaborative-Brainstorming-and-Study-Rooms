const express = require('express');
const auth = require("../auth/auth.js");
const router = express.Router();

const users = require("../controllers/user.controller.js");

//Create User  Registers new Users
router.post("/", users.create);

//Get all Users
router.get("/", users.findAll);

//Get a single User with userid
router.get("/:userid", users.findOne);

//Get a single User with username
router.get("/username/:username", users.findOne);
    
//Update User's profile information with userid
router.put("/user/profile", auth.authenticateToken,users.updateInfo);

//Update User's password with userid
router.put("/user/password",auth.authenticateToken, users.updatePassword);

//Update User's admin status with userid
router.put("/:userid/permissions",auth.authenticateToken, users.updateAdminStatus);

//Delete a  User with userid
router.delete("/:userid",auth.authenticateToken, users.delete);

//Delete all Users
router.delete("/",auth.authenticateToken, users.deleteAll);

module.exports = router;
    
