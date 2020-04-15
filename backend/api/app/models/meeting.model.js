const mysql = require("./db.js");

const  Meeting = function (meeting) {
    this.adminId = meeting.adminId;
    this.subject = meeting.subject;
    this.scheduledStart = meeting.scheduledStart;
    this.scheduledEnd = meeting.scheduledEnd;
    this.roomId = meeting.roomId;
};

Meeting.create = (newMeeting, result) => {
    mysql.query("INSERT INTO Meeting SET ?", newMeeting, (err, res) =>
    {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        console.log("Meeting successfully created\nResult: ",{meetingId: res.insertId, ...newMeeting});
        result(null,{meetingId: res.insertId, ...newMeeting});
    });
};

Meeting.getAll =  result => {
    mysql.query("SELECT * FROM Meeting", (err, res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        console.log("Meetings: ", res);
        result(null, res);
    });
};

Meeting.findById = (meetingId, result) => {
    mysql.query(`SELECT * FROM Meeting WHERE meetingId = ${meetingId}`, (err,res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        if(res.length)
        {
            console.log("Meeting with id successfully found ", res[0]);
            result(null, res[0]);
            return;
        }
        //Meeting not found
        result({kind: "not_found"},null);
    });
};

Meeting.findByAdminId = (adminId, result) => {
    mysql.query(`SELECT * FROM Meeting WHERE adminId = ${adminId}`, (err,res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        if(res.length)
        {
            console.log("Meeting with adminId successfully found ", res[0]);
            result(null, res[0]);
            return;
        }
        //Meeting not found
        result({kind: "not_found"},null);
    });
};

Meeting.updateById = (meetingId, meeting, result) => {
    mysql.query("UPDATE Meeting SET  subject = ?, scheduledStart = ?, scheduledEnd = ? WHERE meetingId = ?",
        [meeting.subject, meeting.scheduledStart, meeting.scheduledEnd, meetingId], (err, res) => {
            if(err)
            {
                console.log("ERROR: ", err);
                result(err,null);
                return;
            }
            if (res.affectedRows == 0)
            {
                //Meeting with id not found
                result({ kind: "not_found" }, null);
                return;
            }
            console.log("Meeting info successfully updated\nResult: ",{meetingId: meetingId, ...meeting});
            result(null, {meetingId: meetingId, ...meeting});
        });
};
Meeting.updateRoomById = (meetingId, roomId, result) => {
    mysql.query("UPDATE Meeting SET roomId = ? WHERE meetingId = ?",
        [roomId, meetingId], (err, res) => {
            if (err) {
                console.log("ERROR: ", err);
                result(err, null);
                return;
            }
            if (res.affectedRows == 0) {
                //Meeting with id not found
                result({kind: "not_found"}, null);
                return;
            }
            console.log("Meeting roomId successfully updated\nResult: ", {meetingId: meetingId, roomId: roomId});
            result(null, {meetingId: meetingId, roomId: roomId});
        });
};

Meeting.remove = (id, result) => {
    mysql.query("DELETE FROM Meeting WHERE meetingId = ?", id, (err, res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        if (res.affectedRows == 0)
        {
            //Meeting with id not found
            result({ kind: "not_found" }, null);
            return;
        }
        console.log("Successfully deleted Meeting with id: ", id);
        result(null, res);
    });
};
Meeting.removeAll = result => {
    mysql.query("DELETE FROM `Meeting`", (err, res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        console.log(`Deleted Meetings: ${res.rowsAffected}`);
        result(null, res);
    });
};

module.exports = Meeting;
