const mysql = require("./db.js");

const  Room = function (room) {
    this.roomName = room.roomName;
    this.boardLink = room.boardLink;
    this.openTime = room.openTime;
    this.closedTime = room.closedTime;
};

Room.create = (room, result) => {
    mysql.query("INSERT INTO Room SET ?", room, (err, res) =>
    {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        console.log("Room successfully added \nResult: ",{roomId:res.insertId, ...room});
        result(null,{roomId:res.insertId, ...room});
    });
};

Room.getAll =  result => {
    mysql.query("SELECT * FROM Room", (err, res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        console.log("Rooms: ", res);
        result(null, res);
    });
};

Room.findById = (roomId, result) => {
    mysql.query(`SELECT * FROM Room WHERE roomId = ${roomId}`, (err,res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        if(res.length)
        {
            console.log("Room with id successfully found ", res[0]);
            result(null, res[0]);
            return;
        }
        //Room not found
        result({kind: "not_found"},null);
    });
};
Room.updateById = (id, room, result) => {
    mysql.query("UPDATE `Room` SET roomName = ?,  boardLink = ?, openTime = ?, closedTime = ? WHERE roomId = ?",
        [room.roomName, room.boardLink, room.openTime, room.closedTime, id], (err, res) => {
            if(err)
            {
                console.log("ERROR: ", err);
                result(err,null);
                return;
            }
            if (res.affectedRows == 0)
            {
                //Room with id not found
                result({ kind: "not_found" }, null);
                return;
            }
            console.log("Room successfully updated\nResult: ",{roomId: id, ...room});
            result(null, {roomId: id, ...room});
        });
};

Room.updateRoomNameById = (id, roomName, result) => {
    mysql.query("UPDATE `Room` SET roomName = ? WHERE roomId = ?",
        [roomName, id], (err, res) => {
            if(err)
            {
                console.log("ERROR: ", err);
                result(err,null);
                return;
            }
            if (res.affectedRows == 0)
            {
                //Room with id not found
                result({ kind: "not_found" }, null);
                return;
            }
            console.log("Room successfully updated\nResult: ",{roomId: id, roomName: roomName});
            result(null, {roomId: id, roomName: roomName});
        });
};

Room.updateClosedTimeById = (id, closedTime, result) => {
    mysql.query("UPDATE `Room` SET closedTime = ? WHERE roomId = ?",
        [closedTime, id], (err, res) => {
            if(err)
            {
                console.log("ERROR: ", err);
                result(err,null);
                return;
            }
            if (res.affectedRows == 0)
            {
                //Room with id not found
                result({ kind: "not_found" }, null);
                return;
            }
            console.log("Room successfully updated\nResult: ",{roomId: id, closedTime: closedTime});
            result(null, {roomId: id, closedTime: closedTime});
        });
};

Room.remove = (id, result) => {
    mysql.query("DELETE FROM Room WHERE roomId = ?", id, (err, res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        if (res.affectedRows == 0)
        {
            //Room with id not found
            result({ kind: "not_found" }, null);
            return;
        }
        console.log("Successfully deleted Room with id: ", id);
        result(null, res);
    });
};
Room.removeAll = result => {
    mysql.query("DELETE FROM `Room`", (err, res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        console.log(`Deleted Rooms: ${res.rowsAffected}`);
        result(null, res);
    });
};

module.exports = Room;
