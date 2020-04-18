const Meeting = require("../models/meeting.model.js");
const Schedule = require("../models/schedule.model.js");
const User = require("../models/user.model.js");
//Create and store a new Meeting in db
exports.create = (req, res) => {
    //Check if request is valid
    if (!req.body) {
        res.status(400).send({
            message: "Request body must contain content"
        });
    }
    //Create meeting
    const meeting = new Meeting({
        adminId: req.user.userid,
        subject: req.body.subject,
        scheduledStart: req.body.scheduledStart,
        scheduledEnd: req.body.scheduledEnd,
        roomId: req.body.roomId
    });
    //Store meeting in db
    return new Promise((resolve, reject) => {
        Meeting.create(meeting, (err, data) => {
            if(err)
            {
                reject(err);
            }
            else
            {
                resolve(data);
            }
        });
    }).then((data) => {
        res.send(data);
        const schedule = new Schedule({
            meetingId: data["meetingId"],
            userid: data["adminId"]
        });
        Schedule.create(schedule,(err, data) => {
            if(err)
            {
                console.log("An error occurred while adding meeting admin to schedule");
            }
            else
            {
                console.log("Meeting admin successfully added to schedule");
            }
        });
    }, (err) => {
        req.status(500).send({
            message: err.message || "An internal server error occurred while creating Meeting."
        });
    });

};

exports.findAll = (req, res) => {
        Meeting.getAll((err, data) => {
            if(err)
            {
                res.status(500).send({
                    message: err.message || "An internal server error occurred while getting all meetings."
                });
            }
            else
            {
                res.send(data);
            }
        });
};

exports.findOne = (req, res) => {
        Meeting.findById(req.params.meetingId, (err, data) => {
            if(err)
            {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Meeting not found with meetingId ${req.params.meetingId}.`
                    });
                }
                else
                {
                    res.status(500).send({
                        message: err.message ||  `An internal server error occurred while getting group with meetingId ${req.params.meetingId}.`
                    });
                }
            }
            else
            {
                res.send(data);
            }
        });
};

exports.findByAdmin = (req, res) => {
        Meeting.findByAdminId(req.params.adminId, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Meeting not found with adminId ${req.params.adminId}.`
                    });
                } else {
                    res.status(500).send({
                        message: err.message || `An internal server error occurred while getting group with adminId ${req.params.adminId}.`
                    });
                }
            } else {
                res.send(data);
            }
        });
};

exports.update = (req, res) => {
    //Check if request is valid
    if(!req.body)
    {
        req.status(400).send({
            message: "Request body must contain content"
        });
    }
    Meeting.findById(req.params.meetingId, (err, meetingData) => {
        if (meetingData.adminId != req.user.userid) {
            res.status(403).send({
                message: "You are not the meeting admin"
            });
            return;
        }
        Meeting.updateById(req.params.meetingId,
            new Meeting(req.body), (err, data) => {
                if (err) {
                    if (err.kind === "not_found") {
                        res.status(404).send({
                            message: `Meeting not found with meetingId ${req.params.meetingId}.`
                        });
                    } else {
                        res.status(500).send({
                            message: err.message || `An internal server error occurred while updating meeting with meetingId ${req.params.meetingId}.`
                        });
                    }
                } else {
                    res.send(data);
                }
            });
    });
};

exports.updateRoom = (req, res) => {
    //Check if request is valid
    if(!req.body)
    {
        req.status(400).send({
            message: "Request body must contain content"
        });
    }
    Meeting.findById(req.params.meetingId, (err, meetingData) => {
        if (meetingData.adminId != req.user.userid) {
            res.status(403).send({
                message: "You are not the meeting admin"
            });
            return;
        }
        Meeting.updateRoomById(req.params.meetingId, req.body.roomId, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Meeting not found with meetingId ${req.params.meetingId}.`
                    });
                } else {
                    res.status(500).send({
                        message: err.message || `An internal server error occurred while updating meeting room with meetingId ${req.params.meetingId}.`
                    });
                }
            } else {
                res.send(data);
            }
        });
    });
};

exports.delete = (req, res) => {
    Meeting.findById(req.params.meetingId, (err, meetingData) => {
        if (meetingData.adminId != req.user.userid) {
            res.status(403).send({
                message: "You are not the meeting admin"
            });
            return;
        }
        Meeting.remove(req.params.meetingId, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Meeting not found with meetingId ${req.params.meetingId}.`
                    });
                } else {
                    res.status(500).send({
                        message: err.message || `An internal server error occurred while deleting meeting with meetingId ${req.params.meetingId}.`
                    });
                }
            } else {
                res.send({message: `Meeting successfully deleted!`});
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
        Meeting.removeAll((err, data) => {
            if (err) {
                res.status(500).send({
                    message: err.message || `An internal server error occurred while deleting all meetings.`
                });
            } else {
                res.send({message: `All Meetings successfully deleted!`});
            }
        });
    });
};
