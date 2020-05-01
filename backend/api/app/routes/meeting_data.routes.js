const express = require('express');
const router = express.Router();
const meetings = require("../controllers/meeting.controller.js");
const auth = require("../auth/auth.js")

const meeting_data = require("../controllers/meeting_data.controller.js");

//Create meeting_data
router.post("/data/all", auth.authenticateToken, meeting_data.create);

//Get all meeting_data
router.get("/data/all", meeting_data.findAll);

//Get all meeting's meeting_data
router.get("/:meetingId/data", meeting_data.findAllMeetingDataByMeeting);

//Get all meeting's meeting_data by user
router.get("/:meetingId/data/users/:userid", meeting_data.findAllMeetingDataByMeetingAndUser);

//Get a single meeting_data with meetingId and dataId
router.get("/:meetingId/data/:dataId", meeting_data.findOne);

//Update a single meeting_data with meetingId and dataId
router.put("/:meetingId/data/:dataId",auth.authenticateToken, meeting_data.update);

//Update a single meeting_data's filename with meetingId and dataId
router.put("/:meetingId/data/:dataId/filename",auth.authenticateToken, meeting_data.updateFilename);

//Delete a single meeting_data with meetingId and dataId
router.delete("/:meetingId/data/:dataId",auth.authenticateToken, meeting_data.delete);

//Get all meeting's meeting_data
router.delete("/:meetingId/data",auth.authenticateToken, meeting_data.deleteAllMeetingDataByMeeting);

//Delete all meeting_data
router.delete("/data/all", auth.authenticateToken, meeting_data.deleteAll);

module.exports = router;
