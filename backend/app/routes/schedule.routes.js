const express = require('express');
const router = express.Router();

const schedules = require("../controllers/schedule.controller.js");

//Create schedule
router.post("/", schedules.create);

//Get all schedules
router.get("/", schedules.findAll);

//Get all meeting's schedules
router.get("/meetings/:meetingId", schedules.findAllSchedulesByMeeting);

//Get all user's schedules
router.get("/users/:userid", schedules.findAllSchedulesByUser);

//Get all group's schedules
router.get("/groups/:groupId", schedules.findAllSchedulesByGroup);

//Delete user schedule
router.delete("/meetings/:meetingId/users/:userid", schedules.deleteUserSchedule);

//Delete group schedule
router.delete("/meetings/:meetingId/groups/:groupId", schedules.deleteGroupSchedule);

//Delete all meeting's schedules
router.delete("/meetings/:meetingId", schedules.deleteAllSchedulesByMeeting);

//Delete all user's schedules
router.delete("/users/:userid", schedules.deleteAllSchedulesByUser);

//Delete all groups's schedules
router.delete("/groups/:groupId", schedules.deleteAllSchedulesByGroup);

//Delete all schedules
router.delete("/", schedules.deleteAll);

module.exports = router;
