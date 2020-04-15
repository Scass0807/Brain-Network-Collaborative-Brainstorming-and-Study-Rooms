const Schedule = require("../models/schedule.model.js");
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
    return new  Promise((resolve, reject) => {
        Schedule.getAll((err, data) => {
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
            var groupId = data[index]["groupId"];
            data[index]["meeting"] = `/meetings/${meetingId}`;
            if(userid != null)
            {
                data[index]["user"] = `/users/${userid}`;
                delete data[index]["userid"];
            }
            else if(groupId != null)
            {
                data[index]["group"] = `/groups/${groupId}`;
                delete data[index]["groupId"];
            }

        }
        return data;
    },(err) => {
        res.status(500).send({
            message: err.message || "An internal server error occurred while getting all schedules."
        });
    }).then((data) => {
        res.send(data);
    },(err) => {
        res.status(500).send({
            message: err.message || "An internal server error occurred while adding links"
        });
    });
};

exports.findAllSchedulesByMeeting = (req, res) => {
    return new  Promise((resolve, reject) => {
        Schedule.findAllSchedulesByMeetingId(req.params.meetingId,(err, data) => {
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
            var groupId = data[index]["groupId"];
            data[index]["meeting"] = `/meetings/${meetingId}`;
            delete data[index]["meetingId"];
            if(userid != null)
            {
                data[index]["user"] = `/users/${userid}`;
                delete data[index]["userid"];
            }
            else if(groupId != null)
            {
                data[index]["group"] = `/groups/${groupId}`;
                delete data[index]["groupId"];
            }

        }
        return data;
    },(err) => {
        res.status(500).send({
            message: err.message || "An internal server error occurred while getting all meeting's schedules."
        });
    }).then((data) => {
        res.send(data);
    },(err) => {
        res.status(500).send({
            message: err.message || "An internal server error occurred while adding links"
        });
    });
};

exports.findAllSchedulesByUser = (req, res) => {
    return new  Promise((resolve, reject) => {
        Schedule.findAllSchedulesByUserId(req.params.userid,(err, data) => {
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
            delete data[index]["meetingId"];
            data[index]["user"] = `/users/${userid}`;
            delete data[index]["userid"];
        }
        return data;
    },(err) => {
        res.status(500).send({
            message: err.message || "An internal server error occurred while getting all user's schedules."
        });
    }).then((data) => {
        res.send(data);
    },(err) => {
        res.status(500).send({
            message: err.message || "An internal server error occurred while adding links"
        });
    });
};

exports.findAllSchedulesByGroup = (req, res) => {
    return new  Promise((resolve, reject) => {
        Schedule.findAllSchedulesByGroupId(req.params.groupId,(err, data) => {
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
            var groupId = data[index]["groupId"];
            data[index]["meeting"] = `/meetings/${meetingId}`;
            delete  data[index]["meetingId"];
            data[index]["group"] = `/groups/${groupId}`;
            delete data[index]["groupId"];
        }
        return data;
    },(err) => {
        res.status(500).send({
            message: err.message || "An internal server error occurred while getting all meeting's schedules."
        });
    }).then((data) => {
        res.send(data);
    },(err) => {
        res.status(500).send({
            message: err.message || "An internal server error occurred while adding links"
        });
    });
};

exports.deleteUserSchedule = (req, res) => {
    Schedule.removeUserScheduleByUserIdAndMeetingId(req.params.userid,req.params.meetingId,(err,data) => {
        if(err)
        {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Schedule not found with userid ${req.params.userid}, meetingId ${req.params.meetingId}.`
                });
            }
            else
            {
                res.status(500).send({
                    message: err.message ||  `An internal server error occurred while deleting schedule with userid ${req.params.userid}, meetingId ${req.params.meetingId}.`
                });
            }
        }
        else
        {
            res.send({message: `Schedule deleted!`});
        }
    });
};

exports.deleteGroupSchedule = (req, res) => {
    Schedule.removeGroupScheduleByGroupIdAndMeetingId(req.params.groupId,req.params.meetingId,(err,data) => {
        if(err)
        {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Schedule not found with groupId ${req.params.groupId}, meetingId ${req.params.meetingId}.`
                });
            }
            else
            {
                res.status(500).send({
                    message: err.message ||  `An internal server error occurred while deleting schedule with groupId ${req.params.groupId}, meetingId ${req.params.meetingId}.`
                });
            }
        }
        else
        {
            res.send({message: `Schedule deleted!`});
        }
    });
};

exports.deleteAllSchedulesByMeeting = (req, res) => {
    Schedule.removeAllSchedulesByMeetingId(req.params.meetingId, (err, data) => {
        if(err)
        {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Schedules not found for meeting with meetingId ${req.params.meetingId}.`
                });
            }
            else
            {
                res.status(500).send({
                    message: err.message ||  "An internal server error occurred while deleting meeting's schedules."
                });
            }
        }
        else
        {
            res.send({message: `Meeting's schedules deleted!`});
        }
    });
};

exports.deleteAllSchedulesByUser = (req, res) => {
    Schedule.removeAllSchedulesByUserId(req.params.userid, (err, data) => {
        if(err)
        {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Schedules not found for user with userid ${req.params.userid}.`
                });
            }
            else
            {
                res.status(500).send({
                    message: err.message ||  "An internal server error occurred while deleting user's schedules."
                });
            }
        }
        else
        {
            res.send({message: `User's schedules deleted!`});
        }
    });
};

exports.deleteAllSchedulesByGroup = (req, res) => {
    Schedule.removeAllSchedulesByGroupId(req.params.groupId, (err, data) => {
        if(err)
        {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Schedules not found for group with groupId ${req.params.groupId}.`
                });
            }
            else
            {
                res.status(500).send({
                    message: err.message ||  "An internal server error occurred while deleting groups's schedules."
                });
            }
        }
        else
        {
            res.send({message: `Group's schedules deleted!`});
        }
    });
};

exports.deleteAll = (req, res) => {
    Schedule.removeAll((err, data) => {
        if(err)
        {
            res.status(500).send({
                message: err.message ||  `An internal server error occurred while deleting all schedules.`
            });
        }
        else
        {
            res.send({message: `All schedules successfully deleted!`});
        }
    });
};
