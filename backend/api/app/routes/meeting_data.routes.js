const express = require('express');
const router = express.Router();

const meeting_data = require("../controllers/meeting_data.controller.js");

//Create meeting_data
router.post("/data", meeting_data.create);

//Get all meeting_data
router.get("/data", meeting_data.findAll);

//Get all meeting's meeting_data
router.get("/:meetingId/data", meeting_data.findAllMeetingDataByMeeting);

//Get all meeting's meeting_data by user
router.get("/:meetingId/data/users/:userid", meeting_data.findAllMeetingDataByMeetingAndUser);

//Get a single meeting_data with meetingId and dataId
router.get("/:meetingId/data/:dataId", meeting_data.findOne);

//Update a single meeting_data with meetingId and dataId
router.put("/:meetingId/data/:dataId", meeting_data.update);

//Update a single meeting_data's filename with meetingId and dataId
router.put("/:meetingId/data/:dataId/filename", meeting_data.updateFilename);

//Delete a single meeting_data with meetingId and dataId
router.delete("/:meetingId/data/:dataId", meeting_data.delete);

//Get all meeting's meeting_data
router.delete("/:meetingId/data", meeting_data.deleteAllMeetingDataByMeeting);

//Delete all meeting_data
router.delete("/data", meeting_data.deleteAll);

module.exports = router;
