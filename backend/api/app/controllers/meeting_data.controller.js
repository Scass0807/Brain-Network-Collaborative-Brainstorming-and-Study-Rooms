const MeetingData = require("../models/meeting_data.model.js");

exports.create = (req,res) => {
    //Check if request is valid
    if (!req.body) {
        res.status(400).send({
            message: "Request body must contain content"
        });
    }
    //Create meeting_data
    const meeting_data = new MeetingData({
        meetingId: req.body.meetingId,
        userid: req.body.userid,
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
    return new  Promise((resolve, reject) => {
        MeetingData.getAll((err, data) => {
            if(err)
            {
                reject(err);
            }
            else
            {
                resolve(data);
            }
        });
    }).then((data)=> {
        for (var index = 0; index<data.length;index++)
        {
            var meetingId = data[index]["meetingId"];
            var userid = data[index]["userid"];
            data[index]["meeting"] = `/meetings/${meetingId}`;
            data[index]["meeting"] = `/meetings/${meetingId}`;
            delete data[index]["meetingId"];
            delete data[index]["userid"];
        }
        return data;
    },(err) => {
        res.status(500).send({
            message: err.message || "An internal server error occurred while getting all meeting_data."
        });
    }).then((data) => {
        res.send(data);
    },(err) => {
        res.status(500).send({
            message: err.message || "An internal server error occurred while adding links"
        });
    });
};

exports.findAllMeetingDataByMeeting = (req, res) => {
    return new  Promise((resolve, reject) => {
        MeetingData.findAllMeetingDataByMeetingId(req.params.meetingId,(err, data) => {
            if(err)
            {
                reject(err);
            }
            else
            {
                resolve(data);
            }
        });
    }).then((data)=> {
        for (var index = 0; index<data.length;index++)
        {
            var meetingId = data[index]["meetingId"];
            var userid = data[index]["userid"];
            data[index]["meeting"] = `/meetings/${meetingId}`;
            data[index]["user"] = `/users/${userid}`;
            delete data[index]["meetingId"];
            delete data[index]["userid"];
        }
        return data;
    },(err) => {
        res.status(500).send({
            message: err.message || "An internal server error occurred while getting all meeting's meeting_data."
        });
    }).then((data) => {
        res.send(data);
    },(err) => {
        res.status(500).send({
            message: err.message || "An internal server error occurred while adding links"
        });
    });
};

exports.findAllMeetingDataByMeetingAndUser = (req, res) => {
    return new  Promise((resolve, reject) => {
        MeetingData.findAllMeetingDataByMeetingIdAndUserId(req.params.meetingId, req.params.userid,(err, data) => {
            if(err)
            {
                reject(err);
            }
            else
            {
                resolve(data);
            }
        });
    }).then((data)=> {
        for (var index = 0; index<data.length;index++)
        {
            var meetingId = data[index]["meetingId"];
            var userid = data[index]["userid"];
            data[index]["meeting"] = `/meetings/${meetingId}`;
            data[index]["user"] = `/users/${userid}`;
            delete data[index]["meetingId"];
            delete data[index]["userid"];
        }
        return data;
    },(err) => {
        res.status(500).send({
            message: err.message || "An internal server error occurred while getting all meetings meeting_data by user."
        });
    }).then((data) => {
        res.send(data);
    },(err) => {
        res.status(500).send({
            message: err.message || "An internal server error occurred while adding links"
        });
    });
};

exports.findOne = (req, res) => {
    return new  Promise((resolve, reject) => {
        MeetingData.findMeetingDataByMeetingIdAndDataId(req.params.meetingId, req.params.dataId,(err, data) => {
            if(err)
            {
                reject(err);
            }
            else
            {
                resolve(data);
            }
        });
    }).then((data)=> {
        for (var index = 0; index<data.length;index++)
        {
            var meetingId = data[index]["meetingId"];
            var userid = data[index]["userid"];
            data[index]["meeting"] = `/meetings/${meetingId}`;
            data[index]["user"] = `/users/${userid}`;
            delete data[index]["meetingId"];
            delete data[index]["userid"];
        }
        return data;
    },(err) => {
        res.status(500).send({
            message: err.message || "An internal server error occurred while getting  meeting_data."
        });
    }).then((data) => {
        res.send(data);
    },(err) => {
        res.status(500).send({
            message: err.message || "An internal server error occurred while adding links"
        });
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

    MeetingData.updateByMeetingIdAndDataId(req.params.meetingId,req.params.dataId,
        new MeetingData(req.body), (err, data) => {
            if(err)
            {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `MeetingData not found with meetingId ${req.params.meetingId}, dataId ${req.params.dataId}.`
                    });
                }
                else
                {
                    res.status(500).send({
                        message: err.message ||  `An internal server error occurred while updating meeting_data with meetingId ${req.params.meetingId}, dataId ${req.params.dataId}.`
                    });
                }
            }
            else
            {
                res.send(data);
            }
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

    MeetingData.updateFilenameByMeetingIdAndDataId(req.params.meetingId,req.params.dataId,req.body.filename, (err, data) => {
        if(err)
        {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `MeetingData not found with meetingId ${req.params.meetingId}, dataId ${req.params.dataId}.`
                });
            }
            else
            {
                res.status(500).send({
                    message: err.message ||  `An internal server error occurred while updating meeting_data filename with meetingId ${req.params.meetingId}, dataId ${req.params.dataId}.`
                });
            }
        }
        else
        {
            res.send(data);
        }
    });

};

exports.delete = (req, res) => {
    MeetingData.remove(req.params.meetingId,req.params.dataId,(err,data) => {
        if(err)
        {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `MeetingData not found with meetingId ${req.params.meetingId}, dataId ${req.params.dataId}.`
                });
            }
            else
            {
                res.status(500).send({
                    message: err.message ||  `An internal server error occurred while deleting meeting_data with meetingId ${req.params.meetingId}, dataId ${req.params.dataId}.`
                });
            }
        }
        else
        {
            res.send({message: `MeetingData deleted!`});
        }
    });
};

exports.deleteAllMeetingDataByMeeting = (req, res) => {
    MeetingData.removeAllMeetingDataByMeetingId(req.params.meetingId, (err, data) => {
        if(err)
        {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `MeetingData not found for meeting with meetingId ${req.params.meetingId}.`
                });
            }
            else
            {
                res.status(500).send({
                    message: err.message ||  "An internal server error occurred while deleting meeting's meeting_data."
                });
            }
        }
        else
        {
            res.send({message: `Group's members deleted!`});
        }
    });
};

exports.deleteAll = (req, res) => {
    MeetingData.removeAll((err, data) => {
        if(err)
        {
            res.status(500).send({
                message: err.message ||  `An internal server error occurred while deleting all meetings' meeting_data.`
            });
        }
        else
        {
            res.send({message: `All meetings' meeting_data successfully deleted!`});
        }
    });
};
