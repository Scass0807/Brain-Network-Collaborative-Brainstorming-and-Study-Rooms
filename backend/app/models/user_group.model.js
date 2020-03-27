const mysql = require("./db.js");

const UserGroup = function (user_group) {
  this.userid = user_group.userid;
  this.groupId = user_group.groupId;
};

UserGroup.create = (newUserGroup, result) => {
    mysql.query("INSERT INTO UserGroup SET ?", newUserGroup, (err, res) =>
    {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        console.log("User successfully added to Group\nResult: ",{newUserGroup});
        result(null,{newUserGroup});
    });
};
UserGroup.getAll =  result => {
    mysql.query("SELECT * FROM UserGroup", (err, res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        console.log("User Groups: ", res);
        result(null, res);
    });
};

UserGroup.findAllUsersGroupsByUserId = (userid, result) => {
    mysql.query(`SELECT * FROM UserGroup WHERE userid = ${userid}`, (err,res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        if(res.length)
        {
            console.log("User's groups with userid successfully found ", res);
            result(null, res);
            return;
        }
        //Groups for user not found
        result({kind: "not_found"},null);
    });
};

UserGroup.findAllGroupsMembersByGroupId = (groupId, result) => {
    mysql.query(`SELECT * FROM UserGroup WHERE groupId = ${groupId}`, (err,res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        if(res.length)
        {
            console.log("Groups user's with groupId successfully found ", res);
            result(null, res);
            return;
        }
        //Users for group not found
        result({kind: "not_found"},null);
    });
};

UserGroup.removeUserFromGroupByUserIdAndGroupId = (userid, groupId, result) => {
    mysql.query(`DELETE FROM UserGroup WHERE userid = ${userid} AND groupId = ${groupId}`, (err,res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        if (res.affectedRows == 0)
        {
            //Group for user not found
            result({ kind: "not_found" }, null);
            return;
        }

        console.log(`User from group ${groupId} successfully deleted with userid`, userid);
        result(null, res);
    });
};

UserGroup.removeAllUsersGroupsByUserId = (userid, result) => {
    mysql.query(`DELETE FROM UserGroup WHERE userid = ${userid}`, (err,res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        if (res.affectedRows == 0)
        {
            //Groups for user not found
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("User's groups successfully deleted with userid ", userid);
        result(null, res);

    });
};

UserGroup.removeAllGroupsMembersByGroupId = (groupId, result) => {
    mysql.query(`DELETE FROM UserGroup WHERE groupId = ${groupId}`, (err, res) => {
        if (err) {
            console.log("ERROR: ", err);
            result(err, null);
            return;
        }
        if (res.affectedRows == 0) {

            //Users for group not found
            result({kind: "not_found"}, null);
            return;
        }

        console.log("Groups user's successfully deleted with groupId  ", groupId);
        result(null, res);

    });
};

UserGroup.removeAll = result => {
    mysql.query("DELETE FROM UserGroup", (err, res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        console.log(`Deleted user groups: ${res.rowsAffected}`);
        result(null, res);
    });
};
