const Meeting = require("../models/meeting.model.js");
const Schedule = require("../models/schedule.model.js");
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
        adminId: req.body.adminId,
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
    return new  Promise((resolve, reject) => {
        Meeting.getAll((err, data) => {
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
            var adminId = data[index]["adminId"];
            var roomId = data[index]["roomId"];
            data[index]["admin"] = `/users/${adminId}`;
            data[index]["meeting_ data"] = `/meetings/${meetingId}/data`;
            data[index]["schedule"] = `/schedules/meetings/${meetingId}`;
            if(roomId != null)
            {
                data[index]["room"] = `/meetings/rooms/${roomId}`;
                delete data[index]["roomId"];
            }
            delete data[index]["adminId"];
        }
        return data;
    },(err) => {
        res.status(500).send({
            message: err.message || "An internal server error occurred while getting all groups."
        });
    }).then((data) => {
        res.send(data);
    },(err) => {
        res.status(500).send({
            message: err.message || "An internal server error occurred while adding member links"
        });
    });
};

exports.findOne = (req, res) => {
    return new  Promise((resolve, reject) => {
        Meeting.findById(req.params.meetingId, (err, data) => {
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
        var meetingId = data["meetingId"];
        var adminId = data["adminId"];
        var roomId = data["roomId"];
        data["admin"] = `/users/${adminId}`;
        data["meeting_ data"] = `/meetings/${meetingId}/data`;
        data["schedule"] = `/schedules/meetings/${meetingId}`;
        if(roomId != null)
        {
            data["room"] = `/meetings/rooms/${roomId}`;
            delete data["roomId"];
        }
        delete data["adminId"];
    },(err) =>{
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
    }).then((data) => {
        res.send(data);
    },(err) => {
        res.status(500).send({
            message: err.message || "An internal server error occurred while adding links"
        });
    });

};

exports.findByAdmin = (req, res) => {
    return new  Promise((resolve, reject) => {
        Meeting.findById(req.params.adminId, (err, data) => {
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
        var meetingId = data["meetingId"];
        var adminId = data["adminId"];
        var roomId = data["roomId"];
        data["admin"] = `/users/${adminId}`;
        data["meeting_ data"] = `/meetings/${meetingId}/data`;
        data["schedule"] = `/schedules/meetings/${meetingId}`;
        if(roomId != null)
        {
            data["room"] = `/meetings/rooms/${roomId}`;
            delete data["roomId"];
        }
        delete data["adminId"];
    },(err) =>{
        if (err.kind === "not_found") {
            res.status(404).send({
                message: `Meeting not found with adminId ${req.params.adminId}.`
            });
        }
        else
        {
            res.status(500).send({
                message: err.message ||  `An internal server error occurred while getting group with adminId ${req.params.adminId}.`
            });
        }
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

    Meeting.updateById(req.params.meetingId,
        new Meeting(req.body), (err, data) => {
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
                        message: err.message ||  `An internal server error occurred while updating meeting with meetingId ${req.params.meetingId}.`
                    });
                }
            }
            else
            {
                res.send(data);
            }
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

    Meeting.updateRoomById(req.params.meetingId,req.body.roomId, (err, data) => {
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
                        message: err.message ||  `An internal server error occurred while updating meeting room with meetingId ${req.params.meetingId}.`
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
    Meeting.remove(req.params.meetingId, (err, data) => {
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
                    message: err.message ||  `An internal server error occurred while deleting meeting with meetingId ${req.params.meetingId}.`
                });
            }
        }
        else
        {
            res.send({message: `Meeting successfully deleted!`});
        }
    });
};

exports.deleteAll = (req, res) => {
    Meeting.removeAll((err, data) => {
        if(err)
        {
            res.status(500).send({
                message: err.message ||  `An internal server error occurred while deleting all meetings.`
            });
        }
        else
        {
            res.send({message: `All Meetings successfully deleted!`});
        }
    });
};
