const mysql = require("./db.js");
const bcrypt = require("bcrypt");

const User = function (user) {
    this.username = user.username;
    this.email = user.email;
    this.password = user.password;
    this.fname = user.fname;
    this.lname = user.lname;
    this.admin = user.admin;
};

User.create = (newUser, result) => {
    bcrypt.genSalt(10, function (err,salt) {
        bcrypt.hash(newUser.password, salt, function (err,hash) {
            newUser.password = hash;
            if(newUser.admin === undefined)
            {
                mysql.query("INSERT INTO User SET username = ?, email = ?, password = ?, fname = ?, lname = ?",
                    [newUser.username, newUser.email, newUser.password, newUser.fname, newUser.lname], (err, res) =>
                {
                    if(err)
                    {
                        console.log("ERROR: ", err);
                        result(err,null);
                        return;
                    }
                    console.log("User successfully registered\nResult: ",{id: res.insertId, username: newUser.username, email: newUser.email, fname: newUser.fname, lname: newUser.lname});
                    result(null,{id: res.insertId, username: newUser.username, email: newUser.email, fname: newUser.fname, lname: newUser.lname});
                });
            }
            else
            {
                mysql.query("INSERT INTO User SET ?", newUser, (err, res) =>
                {
                    if(err)
                    {
                        console.log("ERROR: ", err);
                        result(err,null);
                        return;
                    }
                    console.log("User successfully registered\nResult: ",{id: res.insertId, username: newUser.username, email: newUser.email, fname: newUser.fname, lname: newUser.lname, admin: newUser.admin});
                    result(null,{id: res.insertId, username: newUser.username, email: newUser.email, fname: newUser.fname, lname: newUser.lname, admin: newUser.admin});
                });
            }
        });
    });
};

User.findById = (userId, result) => {
  mysql.query(`SELECT username, email, fname, lname, admin FROM User WHERE userid = ${userId}`, (err,res) => {
      if(err)
      {
          console.log("ERROR: ", err);
          result(err,null);
          return;
      }
      if(res.length)
      {
          console.log("User with id successfully found ", res[0]);
          result(null, res[0]);
          return;
      }
      //User not found
      result({kind: "not_found"},null);
  });
};

User.findByUsername = (username, result) => {
    mysql.query(`SELECT username, email, fname, lname, admin FROM User WHERE username = '${username}'`,(err, res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        if(res.length)
        {
            console.log("User with username successfully found ", res[0]);
            result(null, res[0]);
            return;
        }
        //User not found
        result({kind: "not_found"},null);
    });
};

User.getAll =  result => {
  mysql.query("SELECT username, email, fname, lname, admin FROM User", (err, res) => {
      if(err)
      {
          console.log("ERROR: ", err);
          result(err,null);
          return;
      }
      console.log("Users: ", res);
      result(null, res);
  });
};
User.updateInfoById = (id,user,result) => {
    mysql.query("UPDATE User SET  username = ?, email = ?, fname = ?, lname = ? WHERE userid = ?",
        [user.username, user.email, user.fname, user.lname, id], (err, res) => {
            if(err)
            {
                console.log("ERROR: ", err);
                result(err,null);
                return;
            }
            if (res.affectedRows == 0)
            {
                //User with id not found
                result({ kind: "not_found" }, null);
                return;
            }
            console.log("User info successfully updated\nResult: ",{id: id, ...user});
            result(null, {id: id, ...user});
        });
};
User.updatePasswordById = (id, password, result) => {
    bcrypt.genSalt(10, function (err,salt) {
        bcrypt.hash(password, salt, function (err, hash) {
            password = hash;
            mysql.query("UPDATE User SET password = ? WHERE userid = ?", [password,id], (err, res) => {
                if(err)
                {
                    console.log("ERROR: ", err);
                    result(err,null);
                    return;
                }
                if (res.affectedRows == 0)
                {
                    //User with id not found
                    result({ kind: "not_found" }, null);
                    return;
                }
                console.log("User password successfully updated\nResult: ",{id: id, password: password});
                result(null, {id: id, password: password});
            });
        });
    });
};
User.updateAdminStatusById = (id, admin, result) => {
  mysql.query("UPDATE User SET admin = ? WHERE userid = ?",[admin,id], (err, res) => {
      if(err)
      {
          console.log("ERROR: ", err);
          result(err,null);
          return;
      }
      if (res.affectedRows == 0)
      {
          //User with id not found
          result({ kind: "not_found" }, null);
          return;
      }
      console.log("User admin status successfully updated\nResult: ",{id: id, admin: admin});
      result(null, {id: id, admin: admin});
  });
};
User.remove = (id, result) => {
  mysql.query("DELETE FROM User WHERE userid = ?", id, (err, res) => {
      if(err)
      {
          console.log("ERROR: ", err);
          result(err,null);
          return;
      }
      if (res.affectedRows == 0)
      {
          //User with id not found
          result({ kind: "not_found" }, null);
          return;
      }
      console.log("Successfully deleted user with id: ", id);
      result(null, res);
    });
};
User.removeAll = result => {
  mysql.query("DELETE FROM User", (err, res) => {
      if(err)
      {
          console.log("ERROR: ", err);
          result(err,null);
          return;
      }
      console.log(`Deleted users: ${res.rowsAffected}`);
      result(null, res);
  });
};

module.exports = User;
