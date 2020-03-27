const express = require('express');
const router = express.Router();

const users = require("../controllers/user.controller.js");

//Create User
router.post("/", users.create);

//Get all Users
router.get("/", users.findAll);

//Get a single User with userid
router.get("/:userid", users.findOne);

//Get a single User with username
router.get("/username/:username", users.findOne);
    
//Update User's profile information with userid
router.put("/:userid/profile", users.updateInfo);

//Update User's password with userid
router.put("/:userid/password", users.updatePassword);

//Update User's admin status with userid
router.put("/:userid/permissions", users.updateAdminStatus);

//Delete a  User with userid
router.delete("/:userid", users.delete);

//Delete all Users
router.delete("/", users.deleteAll);

module.exports = router;
    
