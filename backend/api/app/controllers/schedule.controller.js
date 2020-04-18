const Schedule = require("../models/schedule.model.js");
const Meeting = require("../models/meeting.model.js");
const User = require("../models/user.model.js");
const Group = require("../models/group.model.js");
exports.create = (req, res) => {
    //Check if request is valid
    if(!req.body)
    {
        req.status(400).send({
            message: "Request body must contain content"
        });
    }

    //Create schedule
    const schedule = new Schedule ({
        meetingId: req.body.meetingId,
        userid: req.body.userid,
        groupId: req.body.groupId
    });

    //Store schedule in db
    Schedule.create(schedule, (err, data) => {
        if(err)
        {
            req.status(500).send({
                message: err.message || "An internal server error occurred while creating Schedule."
            });
        }
        else
        {
            res.send(data);
        }
    });
};

exports.findAll = (req, res) => {
        Schedule.getAll((err, data) => {
            if(err)
            {
                res.status(500).send({
                    message: err.message || "An internal server error occurred while getting all schedules."
                });
            }
            else
            {
                res.send(data);
            }
        });
};

exports.findAllSchedulesByMeeting = (req, res) => {
        Schedule.findAllSchedulesByMeetingId(req.params.meetingId,(err, data) => {
            if(err)
            {
                res.status(500).send({
                    message: err.message || "An internal server error occurred while getting all meeting's schedules."
                });
            }
            else
            {
                res.send(data);
            }
        });
};

exports.findAllSchedulesByUser = (req, res) => {
        Schedule.findAllSchedulesByUserId(req.params.userid,(err, data) => {
            if(err)
            {
                res.status(500).send({
                    message: err.message || "An internal server error occurred while getting all user's schedules."
                });
            }
            else
            {
                res.send(data);
            }
        });
};

exports.findAllSchedulesByGroup = (req, res) => {
        Schedule.findAllSchedulesByGroupId(req.params.groupId,(err, data) => {
            if(err)
            {
                res.status(500).send({
                    message: err.message || "An internal server error occurred while getting all group's schedules."
                });
            }
            else
            {
                res.send(data);
            }
        });

};

exports.deleteUserSchedule = (req, res) => {
        Meeting.findById(req.params.meetingId, (err, meetingData) => {
            if ((req.user.userid != req.params.userid) && (req.user.userid != meetingData.adminId)) {
                res.status(403).send({
                    message: "You are not the meeting admin or the user to be deleted"
                });
                return;
            }
            Schedule.removeUserScheduleByUserIdAndMeetingId(req.params.userid, req.params.meetingId, (err, data) => {
                if (err) {
                    if (err.kind === "not_found") {
                        res.status(404).send({
                            message: `Schedule not found with userid ${req.params.userid}, meetingId ${req.params.meetingId}.`
                        });
                    } else {
                        res.status(500).send({
                            message: err.message || `An internal server error occurred while deleting schedule with userid ${req.params.userid}, meetingId ${req.params.meetingId}.`
                        });
                    }
                } else {
                    res.send({message: `Schedule deleted!`});
                }
            });
        });
};

exports.deleteGroupSchedule = (req, res) => {
    Group.findById(req.params.groupId, (err, groupData) => {
        Meeting.findById(req.params.meetingId, (err, meetingData) => {
            if ((groupData.managerId != req.user.userid) && (meetingData.adminId != req.user.userid)) {
                res.status(403).send({
                    message: "You are not the meeting admin or the group to be deleted"
                });
                return;
            }

            Schedule.removeGroupScheduleByGroupIdAndMeetingId(req.params.groupId, req.params.meetingId, (err, data) => {
                if (err) {
                    if (err.kind === "not_found") {
                        res.status(404).send({
                            message: `Schedule not found with groupId ${req.params.groupId}, meetingId ${req.params.meetingId}.`
                        });
                    } else {
                        res.status(500).send({
                            message: err.message || `An internal server error occurred while deleting schedule with groupId ${req.params.groupId}, meetingId ${req.params.meetingId}.`
                        });
                    }
                } else {
                    res.send({message: `Schedule deleted!`});
                }
            });
        });
    });
};

exports.deleteAllSchedulesByMeeting = (req, res) => {
    Meeting.findById(req.params.meetingId, (err, meetingData) => {
        if (meetingData.adminId != req.user.userid) {
            res.status(403).send({
                message: "You are not the meeting admin"
            });
            return;
        }
        Schedule.removeAllSchedulesByMeetingId(req.params.meetingId, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Schedules not found for meeting with meetingId ${req.params.meetingId}.`
                    });
                } else {
                    res.status(500).send({
                        message: err.message || "An internal server error occurred while deleting meeting's schedules."
                    });
                }
            } else {
                res.send({message: `Meeting's schedules deleted!`});
            }
        });
    });
};

exports.deleteAllSchedulesByUser = (req, res) => {
    User.findById(req.params.userid, (err, userData) => {
        if (userData.userid != req.user.userid) {
            res.status(403).send({
                message: "You are not the user"
            });
            return;
        }
        Schedule.removeAllSchedulesByUserId(req.params.userid, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Schedules not found for user with userid ${req.params.userid}.`
                    });
                } else {
                    res.status(500).send({
                        message: err.message || "An internal server error occurred while deleting user's schedules."
                    });
                }
            } else {
                res.send({message: `User's schedules deleted!`});
            }
        });
    });
};

exports.deleteAllSchedulesByGroup = (req, res) => {
    User.findById(req.params.groupId, (err, groupData) => {
        if (groupData.managerId != req.user.userid) {
            res.status(403).send({
                message: "You are not the group"
            });
            return;
        }
        Schedule.removeAllSchedulesByGroupId(req.params.groupId, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Schedules not found for group with groupId ${req.params.groupId}.`
                    });
                } else {
                    res.status(500).send({
                        message: err.message || "An internal server error occurred while deleting groups's schedules."
                    });
                }
            } else {
                res.send({message: `Group's schedules deleted!`});
            }
        });
    });
};

exports.deleteAll = (req, res) => {
    User.findById(req.user.userid, (err, adminData) => {
        if (adminData.admin != 1) {
            res.status(403).send({
                message: "You are not an admin"
            });
            return;
        }
        Schedule.removeAll((err, data) => {
            if (err) {
                res.status(500).send({
                    message: err.message || `An internal server error occurred while deleting all schedules.`
                });
            } else {
                res.send({message: `All schedules successfully deleted!`});
            }
        });
    });
};
