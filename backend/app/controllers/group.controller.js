const Group = require("../models/group.model.js");

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
  Group.create(group, (err, data) => {
     if(err)
     {
         req.status(500).send({
             message: err.message || "An internal server error occurred while creating Group."
         });
     }
     else
     {
         res.send(data);
     }
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
    if(req.param("groupId") === '' || req.param("groupId") === undefined)
    {
        Group.findByName(req.params.name, (err, data) => {
           if(err)
           {
               if(err.kind === "not_found")
               {
                   res.status(404).send({
                       message: `Group not found with name ${req.params.name}.`
                   });
               }
               else
               {
                   res.status(500).send({
                       message: err.message ||  `An internal server error occurred while getting group with name ${req.params.name}.`
                   });
               }
           }
           else
           {
               res.send(data);
           }
        });
    }
    else
    {
        Group.findById(req.params.groupId, (err, data) => {
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
                        message: err.message ||  `An internal server error occurred while getting group with groupId ${req.params.groupId}.`
                    });
                }
            }
            else
            {
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
                  message: `No group found with managerId ${req.params.managerId}.`
              });
          }
          else
          {
              res.status(500).send({
                  message: err.message ||  `An internal server error occurred while getting groups with managerId ${req.params.managerId}.`
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
                    message: err.message ||  `An internal server error occurred while updating group with groupId ${req.params.groupId}.`
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
