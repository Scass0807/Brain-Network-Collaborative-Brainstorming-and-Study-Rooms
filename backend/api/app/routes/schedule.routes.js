const express = require('express');
const router = express.Router();
const auth = require("../auth/auth.js");

const schedules = require("../controllers/schedule.controller.js");

//Create schedule
router.post("/", auth.authenticateToken, schedules.create);

//Get all schedules
router.get("/", schedules.findAll);

//Get all meeting's schedules
router.get("/meetings/:meetingId", schedules.findAllSchedulesByMeeting);

//Get all user's schedules
router.get("/users/:userid", schedules.findAllSchedulesByUser);

//Get all group's schedules
router.get("/groups/:groupId", schedules.findAllSchedulesByGroup);

//Delete user schedule
router.delete("/meetings/:meetingId/users/:userid", auth.authenticateToken, schedules.deleteUserSchedule);

//Delete group schedule
router.delete("/meetings/:meetingId/groups/:groupId", auth.authenticateToken, schedules.deleteGroupSchedule);

//Delete all meeting's schedules
router.delete("/meetings/:meetingId",auth.authenticateToken, schedules.deleteAllSchedulesByMeeting);

//Delete all user's schedules
router.delete("/users/:userid", auth.authenticateToken, schedules.deleteAllSchedulesByUser);

//Delete all groups's schedules
router.delete("/groups/:groupId", auth.authenticateToken, schedules.deleteAllSchedulesByGroup);

//Delete all schedules
router.delete("/", auth.authenticateToken, schedules.deleteAll);

module.exports = router;
