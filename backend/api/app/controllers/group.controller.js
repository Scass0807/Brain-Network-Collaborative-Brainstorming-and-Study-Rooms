const Group = require("../models/group.model.js");
const UserGroup = require("../models/user_group.model.js");
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

  //Create group
  const group = new Group ({
      name: req.body.name,
      managerId: req.user.userid
  });

  //Store group in db
  return new Promise((resolve, reject) => {
      Group.create(group, (err, data) => {
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
      const user_group = new UserGroup({
          userid: data["managerId"],
          groupId: data["groupId"]
      });
      UserGroup.create(user_group,(err, data) => {
          if(err)
          {
              console.log("An error occurred while adding group manager to member list");
          }
          else
          {
              console.log("Group manager successfully added to member list");
          }
      });
  }, (err) => {
      req.status(500).send({
          message: err.message || "An internal server error occurred while creating Group."
      });
  });

};

//Get all Groups from db
exports.findAll =  (req, res) => {
        Group.getAll((err, data) => {
            if(err)
            {
                res.status(500).send({
                    message: err.message || "An internal server error occurred while getting all groups."
                });
            }
            else
            {
                res.send(data);
            }
        });
};

exports.findOne = (req, res) => {
    if(req.param('groupId') === '' || req.param('groupId') === undefined)
    {
            Group.findByName(req.params.name, (err, data) => {
                if(err)
                {
                    if (err.kind === "not_found") {
                        res.status(404).send({
                            message: `Group not found with name ${req.params.username}.`
                        });
                    }
                    else
                    {
                        res.status(500).send({
                            message: err.message ||  `An internal server error occurred while getting group with name ${req.params.username}.`
                        });
                    }
                }
                else
                {
                    res.send(data);
                }
            });
    }
    else {
        Group.findById(req.params.groupId, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Group not found with groupId ${req.params.groupId}.`
                    });
                } else {
                    res.status(500).send({
                        message: err.message || `An internal server error occurred while getting group with groupId ${req.params.groupId}.`
                    });
                }
            } else {
                res.send(data);
            }
        });
    }
};
exports.findByManager = (req, res) => {
        Group.findByManagerId(req.params.managerId, (err, data) => {
            if(err)
            {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Group not found with managerId ${req.params.managerId}.`
                    });
                }
                else
                {
                    res.status(500).send({
                        message: err.message ||  `An internal server error occurred while getting group with managerId ${req.params.managerId}.`
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
    Group.findById(req.params.groupId, (err, groupData) => {
        if (groupData.managerId != req.user.userid)
        {
            res.status(403).send({
                message: "You are not group manager"
            });
            return;
        }
        Group.updateById(req.params.groupId,
            new Group(req.body), (err, data) => {
                if(err)
                {
                    if (err.kind === "not_found") {
                        res.status(404).send({
                            message: `Group not found with groupId ${req.params.groupId}.`
                        });
                    }
                    else
                    {
                        res.status(500).send({
                            message: err.message ||  `An internal server error occurred while updating group with groupId ${req.params.groupId}.`
                        });
                    }
                }
                else
                {
                    res.send(data);
                }
            });
    });

};
exports.delete = (req, res) => {
    Group.findById(req.params.groupId, (err, groupData) => {
        if (groupData.managerId != req.user.userid)
        {
            res.status(403).send({
                message: "You are not group manager"
            });
            return;
        }
        Group.remove(req.params.groupId, (err, data) => {
            if(err)
            {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Group not found with groupId ${req.params.groupId}.`
                    });
                }
                else
                {
                    res.status(500).send({
                        message: err.message ||  `An internal server error occurred while deleting group with groupId ${req.params.groupId}.`
                    });
                }
            }
            else
            {
                res.send({message: `Group successfully deleted!`});
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
        Group.removeAll((err, data) => {
            if (err) {
                res.status(500).send({
                    message: err.message || `An internal server error occurred while deleting all groups.`
                });
            } else {
                res.send({message: `All Groups successfully deleted!`});
            }
        });
    })
};
