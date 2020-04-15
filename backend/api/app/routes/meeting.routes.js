const express = require('express');
const router = express.Router();

const meetings = require("../controllers/meeting.controller.js");

//Create Meeting
router.post("/", meetings.create);

//Get all Meetings
router.get("/", meetings.findAll);

//Get a single Meeting with meetingId
router.get("/:meetingId", meetings.findOne);


//Get all Meetings with adminId
router.get("/admin/:adminId", meetings.findByAdmin);

//Update Meeting information with meetingId
router.put("/:meetingId", meetings.update);

//Update Meeting room with meetingId
router.put("/:meetingId/room", meetings.updateRoom);

//Delete a  Meeting with meetingId
router.delete("/:meetingId", meetings.delete);

//Delete all Meetings
router.delete("/", meetings.deleteAll);

module.exports = router;
