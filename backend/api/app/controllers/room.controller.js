const Room = require("../models/room.model.js");

exports.create = (req,res) => {
    //Check if request is valid
    if (!req.body) {
        res.status(400).send({
            message: "Request body must contain content"
        });
    }
    //Create room
    const room = new Room({
        roomName: req.body.roomName,
        boardLink: req.body.boardLink,
        openTime: req.body.openTime,
        closedTime: req.body.closedTime
    });
    //Store romm in db
    Room.create(room, (err, data) => {
        if(err)
        {
            req.status(500).send({
                message: err.message || "An internal server error occurred while creating Room."
            });
        }
        else
        {
            res.send(data);
        }
    });
};

exports.findAll = (req, res) => {
    Room.getAll((err, data) => {
        if(err)
        {
            res.status(500).send({
                message: err.message || "An internal server error occurred while getting all rooms."
            });
        }
        else
        {
            res.send(data);
        }
    });
};

exports.findOne = (req, res) => {
    Room.findById(req.params.roomId, (err, data) => {
        if(err)
        {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Room not found with roomId ${req.params.roomId}.`
                });
            }
            else
            {
                res.status(500).send({
                    message: err.message ||  `An internal server error occurred while getting room with roomId ${req.params.roomId}.`
                });
            }
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

    Room.updateById(req.params.roomId,
        new Room(req.body), (err, data) => {
            if(err)
            {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Room not found with roomId ${req.params.roomId}.`
                    });
                }
                else
                {
                    res.status(500).send({
                        message: err.message ||  `An internal server error occurred while updating room with roomId ${req.params.roomId}.`
                    });
                }
            }
            else
            {
                res.send(data);
            }
        });
};

exports.updateRoomName = (req, res) => {
    //Check if request is valid
    if(!req.body)
    {
        req.status(400).send({
            message: "Request body must contain content"
        });
    }

    Room.updateRoomNameById(req.params.roomId,req.body.roomName, (err, data) => {
        if(err)
        {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Room not found with roomId ${req.params.roomId}.`
                });
            }
            else
            {
                res.status(500).send({
                    message: err.message ||  `An internal server error occurred while updating room name with roomId ${req.params.roomId}.`
                });
            }
        }
        else
        {
            res.send(data);
        }
    });
};

exports.updateClosedTime = (req, res) => {
    //Check if request is valid
    if(!req.body)
    {
        req.status(400).send({
            message: "Request body must contain content"
        });
    }

    Room.updateClosedTimeById(req.params.roomId,req.body.closedTime, (err, data) => {
        if(err)
        {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Room not found with roomId ${req.params.roomId}.`
                });
            }
            else
            {
                res.status(500).send({
                    message: err.message ||  `An internal server error occurred while updating room closedTime with roomId ${req.params.roomId}.`
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
    Room.remove(req.params.roomId, (err, data) => {
        if(err)
        {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Room not found with roomId ${req.params.roomId}.`
                });
            }
            else
            {
                res.status(500).send({
                    message: err.message ||  `An internal server error occurred while deleting room with roomId ${req.params.roomId}.`
                });
            }
        }
        else
        {
            res.send({message: `Room successfully deleted!`});
        }
    });
};

exports.deleteAll = (req, res) => {
    Room.removeAll((err, data) => {
        if(err)
        {
            res.status(500).send({
                message: err.message ||  `An internal server error occurred while deleting all rooms.`
            });
        }
        else
        {
            res.send({message: `All Rooms successfully deleted!`});
        }
    });
};
