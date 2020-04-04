const UserGroup = require("../models/user_group.model.js");

//Create and store a new Group in db
exports.create = (req, res) => {
    //Check if request is valid
    if(!req.body)
    {
        req.status(400).send({
            message: "Request body must contain content"
        });
    }

    //Create user_group
    const user_group = new UserGroup ({
        userid: req.body.userid,
        groupId: req.body.groupId
    });

    //Store usergroup in db
    UserGroup.create(user_group, (err, data) => {
        if(err)
        {
            req.status(500).send({
                message: err.message || "An internal server error occurred while creating UserGroup."
            });
        }
        else
        {
            res.send(data);
        }
    });
};

exports.findAll =  (req, res) => {
    return new  Promise((resolve, reject) => {
        UserGroup.getAll((err, data) => {
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
            var userid = data[index]["userid"];
            var groupId = data[index]["groupId"];
            data[index]["user"] = `/users/${userid}`;
            data[index]["group"] = `/groups/${groupId}`;
            delete data[index]["userid"];
            delete data[index]["groupId"];
        }
        return data;
    },(err) => {
        res.status(500).send({
            message: err.message || "An internal server error occurred while getting all user groups."
        });
    }).then((data) => {
        res.send(data);
    },(err) => {
        res.status(500).send({
            message: err.message || "An internal server error occurred while adding links"
        });
    });
};

exports.findAllUsersGroups = (req,res) => {
    return new  Promise((resolve, reject) => {
        UserGroup.findAllUsersGroupsByUserId(req.params.userid, (err, data) => {
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
            var userid = data[index]["userid"];
            var groupId = data[index]["groupId"];
            data[index]["user"] = `/users/${userid}`;
            data[index]["group"] = `/groups/${groupId}`;
            delete data[index]["userid"];
            delete data[index]["groupId"];
        }
        return data;
    },(err) => {
        if (err.kind === "not_found") {
            res.status(404).send({
                message: `Groups not found for user with userid ${req.params.userid}.`
            });
        }
        else
        {
            res.status(500).send({
                message: err.message || "An internal server error occurred while getting user's groups."
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

exports.findAllGroupsMembers = (req,res) => {
    return new  Promise((resolve, reject) => {
        UserGroup.findAllGroupsMembersByGroupId(req.params.groupId, (err, data) => {
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
        for (var index = 0; index<data.length;index++)
        {
            var userid = data[index]["userid"];
            var groupId = data[index]["groupId"];
            data[index]["user"] = `/users/${userid}`;
            data[index]["group"] = `/groups/${groupId}`;
            delete data[index]["userid"];
            delete data[index]["groupId"];
        }
        return data;
    },(err) => {
        if (err.kind === "not_found") {
            res.status(404).send({
                message: `Members not found for group with groupId ${req.params.groupId}.`
            });
        }
        res.status(500).send({
            message: err.message || "An internal server error occurred while getting group's members."
        });
    }).then((data) => {
        res.send(data);
    },(err) => {
        res.status(500).send({
            message: err.message || "An internal server error occurred while adding links"
        });
    });
};

exports.deleteUserFromGroup = (req, res) => {
    UserGroup.removeUserFromGroupByUserIdAndGroupId(req.params.userid,req.params.groupId,(err,data) => {
        if(err)
        {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Group member not found with userid ${req.params.userid}, groupId ${req.params.groupId}.`
                });
            }
            else
            {
                res.status(500).send({
                    message: err.message ||  `An internal server error occurred while deleting group member with userid ${req.params.userid}, groupId ${req.params.groupId}.`
                });
            }
        }
        else
        {
            res.send({message: `Group member deleted!`});
        }
    });
};

exports.deleteAllUsersGroups = (req,res) => {
    UserGroup.removeAllUsersGroupsByUserId(req.params.userid, (err, data) => {
        if(err)
        {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Groups not found for user with userid ${req.params.userid}.`
                });
            }
            else
            {
                res.status(500).send({
                    message: err.message ||  "An internal server error occurred while deleting user's groups."
                });
            }
        }
        else
        {
            res.send({message: `Group member deleted!`});
        }
    });
};

exports.deleteAllGroupsMembers = (req,res) => {
    UserGroup.removeAllGroupsMembersByGroupId(req.params.groupId, (err, data) => {
        if(err)
        {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Users not found for group with groupId ${req.params.userid}.`
                });
            }
            else
            {
                res.status(500).send({
                    message: err.message ||  "An internal server error occurred while deleting group's members."
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
   UserGroup.removeAll((err, data) => {
        if(err)
        {
            res.status(500).send({
                message: err.message ||  `An internal server error occurred while deleting all group members from all groups.`
            });
        }
        else
        {
            res.send({message: `All group members from all groups successfully deleted!`});
        }
    });
};
