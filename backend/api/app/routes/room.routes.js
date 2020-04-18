const express = require('express');
const router = express.Router();

const rooms = require("../controllers/room.controller.js");

//Create Room
router.post("/",rooms.create);

//Get all Rooms
router.get("/", rooms.findAll);

//Get a single Room with roomId
router.get("/:roomId", rooms.findOne);


//Update Room information with roomId
router.put("/:roomId", rooms.update);

//Update Room name with roomId
router.put("/:roomId/roomName", rooms.updateRoomName);

//Update Room closedTime with roomId
router.put("/:roomId/closedTime", rooms.updateClosedTime);

//Delete a  Room with roomId
router.delete("/:roomId", rooms.delete);

//Delete all Rooms
router.delete("/", rooms.deleteAll);

module.exports = router;
