const express = require('express');
const router = express.Router();

const groups = require("../controllers/group.controller.js");

//Create Group
router.post("/", groups.create);

//Get all Groups
router.get("/", groups.findAll);

//Get a single Group with groupId
router.get("/:groupId", groups.findOne);

//Get a single Group with name
router.get("/name/:name", groups.findOne);

//Get all Groups with managerId
router.get("/manager/:managerId", groups.findByManager);

//Update Group information with groupId
router.put("/:groupId", groups.update);

//Delete a  Group with groupId
router.delete("/:userid", groups.delete);

//Delete all Groups
router.delete("/", groups.deleteAll);

module.exports = router;
