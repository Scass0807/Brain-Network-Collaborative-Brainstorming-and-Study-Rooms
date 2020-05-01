const MeetingData = require("../models/meeting_data.model.js");
const Meeting = require("../models/meeting.model.js");
const User = require("../models/user.model.js");

exports.create = (req,res) => {
    //Check if request is valid
    if (!req.body) {
        res.status(400).send({
            message: "Request body must contain content"
        });
    }
    console.log(req.user)
    //Create meeting_data
    const meeting_data = new MeetingData({
        meetingId: req.body.meetingId,
        userid: req.user.userid,
        timeRecorded: req.body.timeRecorded,
        filename: req.body.filename
    });
    //Store meeting_data in db
    MeetingData.create(meeting_data, (err, data) => {
        if(err)
        {
            req.status(500).send({
                message: err.message || "An internal server error occurred while creating MeetingData."
            });
        }
        else
        {
            res.send(data);
        }
    });
};

exports.findAll = (req, res) => {
        MeetingData.getAll((err, data) => {
            if(err)
            {
                res.status(500).send({
                    message: err.message || "An internal server error occurred while getting all meeting_data."
                });
            }
            else
            {
                res.send(data);
            }
        });
};

exports.findAllMeetingDataByMeeting = (req, res) => {
        MeetingData.findAllMeetingDataByMeetingId(req.params.meetingId,(err, data) => {
            if(err)
            {
                res.status(500).send({
                    message: err.message || "An internal server error occurred while getting all meeting's meeting_data."
                });
            }
            else
            {
                res.send(data);
            }
        });
};

exports.findAllMeetingDataByMeetingAndUser = (req, res) => {
        MeetingData.findAllMeetingDataByMeetingIdAndUserId(req.params.meetingId, req.params.userid,(err, data) => {
            if(err)
            {
                res.status(500).send({
                    message: err.message || "An internal server error occurred while getting all meetings meeting_data by user."
                });
            }
            else
            {
                res.send(data);
            }
        });
};

exports.findOne = (req, res) => {
        MeetingData.findMeetingDataByMeetingIdAndDataId(req.params.meetingId, req.params.dataId,(err, data) => {
            if(err)
            {
                res.status(500).send({
                    message: err.message || "An internal server error occurred while getting  meeting_data."
                });
            }
            else
            {
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
    MeetingData.findMeetingDataByMeetingIdAndDataId(req.params.meetingId, req.params.dataId, (err, meetingDataData) => {
        Meeting.findById(req.params.meetingId, (err, meetingData) => {
            if ((meetingDataData.userid != req.user.userid) && (meetingData.adminId != req.user.userid)) {
                res.status(403).send({
                    message: "You are not the meeting admin or data owner"
                });
                return;
            }

            MeetingData.updateByMeetingIdAndDataId(req.params.meetingId, req.params.dataId,
                new MeetingData(req.body), (err, data) => {
                    if (err) {
                        if (err.kind === "not_found") {
                            res.status(404).send({
                                message: `MeetingData not found with meetingId ${req.params.meetingId}, dataId ${req.params.dataId}.`
                            });
                        } else {
                            res.status(500).send({
                                message: err.message || `An internal server error occurred while updating meeting_data with meetingId ${req.params.meetingId}, dataId ${req.params.dataId}.`
                            });
                        }
                    } else {
                        res.send(data);
                    }
                });
        });
    });
};

exports.updateFilename = (req, res) => {
    //Check if request is valid
    if(!req.body)
    {
        req.status(400).send({
            message: "Request body must contain content"
        });
    }
    MeetingData.findMeetingDataByMeetingIdAndDataId(req.params.meetingId, req.params.dataId, (err, meetingDataData) => {
        Meeting.findById(req.params.meetingId, (err, meetingData) => {
            if ((meetingDataData.userid != req.user.userid) && (meetingData.adminId != req.user.userid)) {
                res.status(403).send({
                    message: "You are not the meeting admin or data owner"
                });
                return;
            }
            MeetingData.updateFilenameByMeetingIdAndDataId(req.params.meetingId, req.params.dataId, req.body.filename, (err, data) => {
                if (err) {
                    if (err.kind === "not_found") {
                        res.status(404).send({
                            message: `MeetingData not found with meetingId ${req.params.meetingId}, dataId ${req.params.dataId}.`
                        });
                    } else {
                        res.status(500).send({
                            message: err.message || `An internal server error occurred while updating meeting_data filename with meetingId ${req.params.meetingId}, dataId ${req.params.dataId}.`
                        });
                    }
                } else {
                    res.send(data);
                }
            });
        });
    });
};

exports.delete = (req, res) => {
    MeetingData.findMeetingDataByMeetingIdAndDataId(req.params.meetingId, req.params.dataId, (err, meetingDataData) => {
        Meeting.findById(req.params.meetingId, (err, meetingData) => {
            if ((meetingDataData.userid != req.user.userid) && (meetingData.adminId != req.user.userid)) {
                res.status(403).send({
                    message: "You are not the meeting admin or data owner"
                });
                return;
            }
            MeetingData.remove(req.params.meetingId, req.params.dataId, (err, data) => {
                if (err) {
                    if (err.kind === "not_found") {
                        res.status(404).send({
                            message: `MeetingData not found with meetingId ${req.params.meetingId}, dataId ${req.params.dataId}.`
                        });
                    } else {
                        res.status(500).send({
                            message: err.message || `An internal server error occurred while deleting meeting_data with meetingId ${req.params.meetingId}, dataId ${req.params.dataId}.`
                        });
                    }
                } else {
                    res.send({message: `MeetingData deleted!`});
                }
            });
        });
    });
};

exports.deleteAllMeetingDataByMeeting = (req, res) => {
    Meeting.findById(req.params.meetingId, (err, meetingData) => {
        if (meetingData.adminId != req.user.userid) {
            res.status(403).send({
                message: "You are not the meeting admin"
            });
            return;
        }
        MeetingData.removeAllMeetingDataByMeetingId(req.params.meetingId, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `MeetingData not found for meeting with meetingId ${req.params.meetingId}.`
                    });
                } else {
                    res.status(500).send({
                        message: err.message || "An internal server error occurred while deleting meeting's meeting_data."
                    });
                }
            } else {
                res.send({message: `Group's members deleted!`});
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
        MeetingData.removeAll((err, data) => {
            if (err) {
                res.status(500).send({
                    message: err.message || `An internal server error occurred while deleting all meetings' meeting_data.`
                });
            } else {
                res.send({message: `All meetings' meeting_data successfully deleted!`});
            }
        });
    });
};
