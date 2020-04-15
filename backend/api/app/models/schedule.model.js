const mysql = require("./db.js");

const Schedule = function (schedule) {
    this.meetingId = schedule.meetingId;
    this.userid = schedule.userid;
    this.groupId = schedule.groupId;
};

Schedule.create = (newSchedule, result) => {
    mysql.query("INSERT INTO Schedule SET ?", newSchedule, (err, res) =>
    {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        console.log("Schedule successfully added for Meeting\nResult: ",{newSchedule});
        result(null,{newSchedule});
    });
};

Schedule.getAll =  result => {
    mysql.query("SELECT * FROM Schedule", (err, res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        console.log("Schedules: ", res);
        result(null, res);
    });
};

Schedule.findAllSchedulesByMeetingId = (meetingId, result) => {
    mysql.query(`SELECT * FROM Schedule WHERE meetingId = ${meetingId}`, (err,res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        if(res.length)
        {
            console.log("Schedules with meetingId successfully found ", res);
            result(null, res);
            return;
        }
        //Schedules for user not found
        result({kind: "not_found"},null);
    });
};

Schedule.findAllSchedulesByUserId = (userid, result) => {
    mysql.query(`SELECT * FROM Schedule WHERE userid = ${userid}`, (err,res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        if(res.length)
        {
            console.log("Schedules with userid successfully found ", res);
            result(null, res);
            return;
        }
        //Schedules for user not found
        result({kind: "not_found"},null);
    });
};

Schedule.findAllSchedulesByGroupId = (groupId, result) => {
    mysql.query(`SELECT * FROM Schedule WHERE groupId = ${groupId}`, (err,res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        if(res.length)
        {
            console.log("Schedules with groupId successfully found ", res);
            result(null, res);
            return;
        }
        //Schedules for group not found
        result({kind: "not_found"},null);
    });
};

Schedule.removeUserScheduleByUserIdAndMeetingId = (userid, meetingId, result) => {
    mysql.query(`DELETE FROM Schedule WHERE userid = ${userid} AND meetingId = ${meetingId}`, (err,res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        if (res.affectedRows == 0)
        {
            //Schedule for user meeting not found
            result({ kind: "not_found" }, null);
            return;
        }

        console.log(`User schedule for meeting ${meetingId} successfully deleted with userid`, userid);
        result(null, res);
    });
};

Schedule.removeGroupScheduleByGroupIdAndMeetingId = (groupId, meetingId, result) => {
    mysql.query(`DELETE FROM Schedule WHERE groupId = ${groupId} AND meetingId = ${meetingId}`, (err,res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        if (res.affectedRows == 0)
        {
            //Schedule for group meeting not found
            result({ kind: "not_found" }, null);
            return;
        }

        console.log(`User schedule for meeting ${meetingId} successfully deleted with userid`, groupId);
        result(null, res);
    });
};

Schedule.removeAllSchedulesByMeetingId = (meetingId, result) => {
    mysql.query(`DELETE FROM Schedule WHERE meetingId = ${meetingId}`, (err,res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        if (res.affectedRows == 0)
        {
            //Schedules for meeting not found
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("Meeting's schedules successfully deleted with meetingId ", meetingId);
        result(null, res);

    });
};

Schedule.removeAllSchedulesByUserId = (userid, result) => {
    mysql.query(`DELETE FROM Schedule WHERE userid = ${userid}`, (err,res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        if (res.affectedRows == 0)
        {
            //Schedules for user not found
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("User's schedules successfully deleted with userid ", userid);
        result(null, res);

    });
};

Schedule.removeAllSchedulesByGroupId = (groupId, result) => {
    mysql.query(`DELETE FROM Schedule WHERE groupId = ${groupId}`, (err,res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        if (res.affectedRows == 0)
        {
            //Schedules for group not found
            result({ kind: "not_found" }, null);
            return;
        }

        console.log("Group's schedules successfully deleted with groupId ", groupId);
        result(null, res);

    });
};

Schedule.removeAll = result => {
    mysql.query("DELETE FROM Schedule", (err, res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        console.log(`Deleted schedules: ${res.rowsAffected}`);
        result(null, res);
    });
};

module.exports = Schedule;
