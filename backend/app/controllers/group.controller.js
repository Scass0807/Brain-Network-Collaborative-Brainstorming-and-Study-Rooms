const Group = require("../models/group.model.js");
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

  //Create group
  const group = new Group ({
      name: req.body.name,
      managerId: req.body.managerId
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
    return new  Promise((resolve, reject) => {
        Group.getAll((err, data) => {
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
            var groupId = data[index]["groupId"];
            var managerId = data[index]["managerId"];
            data[index]["manager"] = `/users/${managerId}`;
            data[index]["group's_ members"] = `/groups/${groupId}/members`;
            data[index]["schedule"] = `/schedules/groups/${groupId}`;
            delete data[index]["managerId"];
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
            message: err.message || "An internal server error occurred while adding links"
        });
    });
};

exports.findOne = (req, res) => {
    if(req.param('groupId') === '' || req.param('groupId') === undefined)
    {
        return new  Promise((resolve, reject) => {
            Group.findByName(req.params.name, (err, data) => {
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
            var groupId = data["groupId"];
            var managerId = data["managerId"];
            data["manager"] = `/users/${managerId}`;
            data["group's_ members"] = `/groups/${groupId}/members`;
            data["schedule"] = `/schedules/groups/${groupId}`;
            delete data["managerId"];
            return data;
        },(err) =>{
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
        }).then((data) => {
            res.send(data);
        },(err) => {
            res.status(500).send({
                message: err.message || "An internal server error occurred while adding links"
            });
        });

    }
    else
    {
        return new  Promise((resolve, reject) => {
            Group.findById(req.params.groupId, (err, data) => {
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
            var groupId = data["groupId"];
            var managerId = data["managerId"];
            data["manager"] = `/users/${managerId}`;
            data["group's_ members"] = `/groups/${groupId}/members`;
            data["schedule"] = `/schedules/groups/${groupId}`;
            delete data["managerId"];
            return data;
        },(err) =>{
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Group not found with groupId ${req.params.groupId}.`
                });
            }
            else
            {
                res.status(500).send({
                    message: err.message ||  `An internal server error occurred while getting group with groupId ${req.params.groupId}.`
                });
            }
        }).then((data) => {
            res.send(data);
        },(err) => {
            res.status(500).send({
                message: err.message || "An internal server error occurred while adding links"
            });
        });
    }
};
exports.findByManager = (req, res) => {
    return new  Promise((resolve, reject) => {
        Group.findByManagerId(req.params.managerId, (err, data) => {
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
        var groupId = data["groupId"];
        var managerId = data["managerId"];
        data["manager"] = `/users/${managerId}`;
        data["group's_ members"] = `/groups/${groupId}/members`;
        data["schedule"] = `/schedules/groups/${groupId}`;
        delete data["managerId"];
        return data;
    },(err) =>{
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
};
exports.delete = (req, res) => {
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
            res.send({message: `User successfully deleted!`});
        }
    });
};
exports.deleteAll = (req, res) => {
    Group.removeAll((err, data) => {
        if(err)
        {
            res.status(500).send({
                message: err.message ||  `An internal server error occurred while deleting all groups.`
            });
        }
        else
        {
            res.send({message: `All Groups successfully deleted!`});
        }
    });
};
