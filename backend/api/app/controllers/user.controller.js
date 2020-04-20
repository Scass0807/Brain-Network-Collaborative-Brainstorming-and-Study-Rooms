const User = require("../models/user.model.js");
//Create and store a new User in db
exports.create = (req, res) => {
    //Check if request is valid
    if (!req.body) {
        res.status(400).send({
            message: "Request body must contain content"
        });
    }
    //Create user
    const user = new User({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password,
        fname: req.body.fname,
        lname: req.body.lname,
        admin: req.body.admin

    });
    //Store user in db
    User.create(user, (err,data) =>
    {
        if(err)
        {
            res.status(500).send({
               message: err.message || "An internal server error occurred while creating User."
            });
        }
        else
        {
            res.send(data);
        }
    });
};
exports.authenticate = (req,res,next) => {
  User.authenticateByUserNamePassword(req.body.username, req.body.password, (err, data) => {
      if(err)
      {
          if (err.kind === "not_found") {
              req.body.authenticated = false;
              next();
          }
          else
          {
              res.status(500).send({
                  message: err.message ||  `An internal server error occurred while getting user with username ${req.params.username}.`
              });
          }
      }
      else
      {
          req.body.userid = data.userid;
          req.body.authenticated = data.authenticated;
          next();
      }


  });
};
//Get all users from db
exports.findAll =  (req, res) => {
      User.getAll((err, data) => {
          if(err)
          {
              res.status(500).send({
                  message: err.message || "An internal server error occurred while getting all users."
              });
          }
          else
          {
              res.send(data);
          }
      });
};
exports.findOne = (req, res) => {
    if(req.param('userid') === '' || req.param('userid') === undefined)
    {
            User.findByUsername(req.params.username, (err, data) => {
                if(err)
                {
                    if (err.kind === "not_found") {
                        res.status(404).send({
                            message: `User not found with username ${req.params.username}.`
                        });
                    }
                    else
                    {
                        res.status(500).send({
                            message: err.message ||  `An internal server error occurred while getting user with username ${req.params.username}.`
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
        User.findById(req.params.userid, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `User not found with userid ${req.params.userid}.`
                    });
                } else {
                    res.status(500).send({
                        message: err.message || `An internal server error occurred while getting user with userid ${req.params.userid}.`
                    });
                }
            } else {
                res.send(data);
            }
        });
    }
};
exports.updateInfo = (req, res) => {
    //Check if request is valid
    if (!req.body) {
        res.status(400).send({
            message: "Request body must contain content"
        });
    }

    User.updateInfoById(req.user.userid,
        new User(req.body),
        (err, data ) => {
            if(err)
            {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `User not found with userid ${req.user.userid}.`
                    });
                }
                else
                {
                    res.status(500).send({
                        message: err.message ||  `An internal server error occurred while updating user info with userid ${req.user.userid}.`
                    });
                }
            }
            else
            {
                res.send(data);
            }
        });
};
exports.updatePassword = (req, res) => {
    //Check if request is valid
    if (!req.body) {
        res.status(400).send({
            message: "Request body must contain content"
        });
    }
    User.updatePasswordById(req.user.userid, req.body.password,(err, data) => {
        if(err)
        {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `User not found with userid ${req.user.userid}.`
                });
            }
            else
            {
                res.status(500).send({
                    message: err.message ||  `An internal server error occurred while updating user password with userid ${req.user.userid}.`
                });
            }
        }
        else
        {
            res.send(data);
        }
    });
};

exports.updateAdminStatus = (req, res) => {
    //Check if request is valid
    if (!req.body) {
        res.status(400).send({
            message: "Request body must contain content"
        });
    }
    User.findById(req.user.userid, (err, adminData) => {
        if (adminData.admin != 1)
        {
            res.status(403).send({
                message: "You are not an admin"
            });
            return;
        }
        User.updateAdminStatusById(req.params.userid, req.body.admin, (err, data) => {
            if(err)
            {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `User not found with userid ${req.params.userid}.`
                    });
                }
                else
                {
                    res.status(500).send({
                        message: err.message ||  `An internal server error occurred while updating user admin status with userid ${req.params.userid}.`
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
    console.log(req.user.userid);
    if (req.user.userid == req.params.userid) {
        User.remove(req.user.userid, (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `User not found with userid ${req.params.userid}.`
                    });
                } else {
                    res.status(500).send({
                        message: err.message || `An internal server error occurred while deleting user with userid ${req.params.userid}.`
                    });
                }
            } else {
                res.send({message: `User successfully deleted!`});
            }
        });
    } else {
        User.findById(req.user.userid, (err, adminData) => {
            if (adminData.admin != 1) {
                res.status(403).send({
                    message: "You are not the user to be deleted or an admin"
                });
                return;
            }
            User.remove(req.params.userid, (err, data) => {
                if (err) {
                    if (err.kind === "not_found") {
                        res.status(404).send({
                            message: `User not found with userid ${req.params.userid}.`
                        });
                    } else {
                        res.status(500).send({
                            message: err.message || `An internal server error occurred while deleting user with userid ${req.params.userid}.`
                        });
                    }
                } else {
                    res.send({message: `User successfully deleted!`});
                }
            });
        });

    }
};
exports.deleteAll = (req, res) => {
    User.findById(req.user.userid, (err, adminData) => {
        if (adminData.admin != 1) {
            res.status(403).send({
                message: "You are not an admin"
            });
            return;
        }
        User.removeAll((err, data) => {
            if (err) {
                res.status(500).send({
                    message: err.message || `An internal server error occurred while deleting all users.`
                });
            } else {
                res.send({message: `All Users successfully deleted!`});
            }
        });
    });

};
