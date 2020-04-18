const UserGroup = require("../models/user_group.model.js");
const Group = require("../models/group.model.js");
const User = require("../models/user.model.js");

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
        groupId: req.params.groupId
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
        UserGroup.getAll((err, data) => {
            if(err)
            {
                res.status(500).send({
                    message: err.message || "An internal server error occurred while getting all user groups."
                });
            }
            else
            {
                res.send(data);
            }
        });

};

exports.findAllUsersGroups = (req,res) => {
    UserGroup.findAllUsersGroupsByUserId(req.params.userid, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Groups not found for user with userid ${req.params.userid}.`
                });
            } else {
                res.status(500).send({
                    message: err.message || "An internal server error occurred while getting user's groups."
                });
            }
        } else {
            res.send(data);
        }
    });
};

exports.findAllGroupsMembers = (req,res) => {
        UserGroup.findAllGroupsMembersByGroupId(req.params.groupId, (err, data) => {
            if(err)
            {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Members not found for group with groupId ${req.params.groupId}.`
                    });
                }
                res.status(500).send({
                    message: err.message || "An internal server error occurred while getting group's members."
                });
            }
            else
            {
                res.send(data);
            }
        });
};

exports.deleteUserFromGroup = (req, res) => {
    Group.findById(req.params.groupId, (err, groupData) => {
        if ((groupData.managerId != req.user.userid) && (req.params.userid != req.user.userid))
        {
            res.status(403).send({
                message: "You are not group manager or user to be deleted"
            });
            return;
        }
        UserGroup.removeUserFromGroupByUserIdAndGroupId(req.params.userid, req.params.groupId, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Group member not found with userid ${req.params.userid}, groupId ${req.params.groupId}.`
                    });
                } else {
                    res.status(500).send({
                        message: err.message || `An internal server error occurred while deleting group member with userid ${req.params.userid}, groupId ${req.params.groupId}.`
                    });
                }
            } else {
                res.send({message: `Group member deleted!`});
            }
        });
    });
};

exports.deleteAllUsersGroups = (req,res) => {
    if(req.params.userid != req.user.userid)
    {
        res.status(403).send({
            message: "You are not the user to be deleted"
        });
        return;
    }
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
    Group.findById(req.params.groupId, (err, groupData) => {
        if (groupData.managerId != req.user.userid) {
            res.status(403).send({
                message: "You are not the group manager"
            });
            return;
        }
        UserGroup.removeAllGroupsMembersByGroupId(req.params.groupId, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Users not found for group with groupId ${req.params.userid}.`
                    });
                } else {
                    res.status(500).send({
                        message: err.message || "An internal server error occurred while deleting group's members."
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
        UserGroup.removeAll((err, data) => {
            if (err) {
                res.status(500).send({
                    message: err.message || `An internal server error occurred while deleting all group members from all groups.`
                });
            } else {
                res.send({message: `All group members from all groups successfully deleted!`});
            }
        });
    });
};
