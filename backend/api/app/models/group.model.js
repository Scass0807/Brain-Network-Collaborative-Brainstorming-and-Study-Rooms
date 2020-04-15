const mysql = require("./db.js");

const Group = function (group) {
    this.name = group.name;
    this.managerId = group.managerId;
};

Group.create = (newGroup, result) => {
    mysql.query("INSERT INTO `Group` SET ?", newGroup, (err, res) =>
    {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        console.log("Group successfully created\nResult: ",{groupId: res.insertId, ...newGroup});
        result(null,{groupId: res.insertId, ...newGroup});
    });
};

Group.findById = (groupId, result) => {
    mysql.query(`SELECT * FROM \`Group\` WHERE groupId = ${groupId}`, (err,res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        if(res.length)
        {
            console.log("Group with id successfully found ", res[0]);
            result(null, res[0]);
            return;
        }
        //Group not found
        result({kind: "not_found"},null);
    });
};

Group.findByName = (name, result) => {
    mysql.query(`SELECT * FROM \`Group\` WHERE name = '${name}'`,(err, res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        if(res.length)
        {
            console.log("Group with name successfully found ", res[0]);
            result(null, res[0]);
            return;
        }
        //Group not found
        result({kind: "not_found"},null);
    });
};

Group.findByManagerId = (managerId, result) => {
    mysql.query(`SELECT * FROM \`Group\` WHERE managerId = ${managerId}`, (err, res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        console.log("Groups: ", res);
        result(null, res);
    });
};

Group.getAll =  result => {
    mysql.query("SELECT * FROM `Group`", (err, res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        console.log("Groups: ", res);
        result(null, res);
    });
};

Group.updateById = (id, group, result) => {
    mysql.query("UPDATE `Group` SET name = ?, managerId = ? WHERE groupId = ?",
        [group.name, group.managerId, id], (err, res) => {
            if(err)
            {
                console.log("ERROR: ", err);
                result(err,null);
                return;
            }
            if (res.affectedRows == 0)
            {
                //Group with id not found
                result({ kind: "not_found" }, null);
                return;
            }
            console.log("Group successfully updated\nResult: ",{groupId: id, ...group});
            result(null, {groupId: id, ...group});
        });
};

Group.remove = (id, result) => {
    mysql.query("DELETE FROM `Group` WHERE groupId = ?", id, (err, res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        if (res.affectedRows == 0)
        {
            //Group with id not found
            result({ kind: "not_found" }, null);
            return;
        }
        console.log("Successfully deleted group with id: ", id);
        result(null, res);
    });
};
Group.removeAll = result => {
    mysql.query("DELETE FROM `Group`", (err, res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        console.log(`Deleted groups: ${res.rowsAffected}`);
        result(null, res);
    });
};

module.exports = Group;
