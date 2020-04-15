const mysql = require("./db.js");

const MeetingData = function (meeting_data) {
    this.meetingId = meeting_data.meetingId;
    this.userid = meeting_data.userid;
    this.timeRecorded = meeting_data.timeRecorded;
    this.filename = meeting_data.filename;
};

MeetingData.create = (newMeetingData, result) => {
    mysql.query("INSERT INTO MeetingData SET meetingId = ?, userid = ?, timeRecorded = ?, filename = ?", [newMeetingData.meetingId, newMeetingData.userid, newMeetingData.timeRecorded, newMeetingData.filename], (err, res) =>
    {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        console.log("MeetingData successfully added for Meeting\nResult: ",{newMeetingData});
        result(null,{newMeetingData});
    });
};

MeetingData.getAll =  result => {
    mysql.query("SELECT * FROM MeetingData", (err, res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        console.log("MeetingData: ", res);
        result(null, res);
    });
};
MeetingData.findAllMeetingDataByMeetingId = (meetingId, result) => {
    mysql.query(`SELECT * FROM MeetingData WHERE meetingId = ${meetingId}`, (err,res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        if(res.length)
        {
            console.log("MeetingData with meetingId successfully found ", res);
            result(null, res);
            return;
        }
        //MeetingData for meeting not found
        result({kind: "not_found"},null);
    });
};
MeetingData.findAllMeetingDataByMeetingIdAndUserId = (meetingId, userid, result) => {
    mysql.query(`SELECT * FROM MeetingData WHERE meetingId = ${meetingId} AND userid = ${userid}`, (err,res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        if(res.length)
        {
            console.log("MeetingData with meetingId created by user with userid successfully found ", res);
            result(null, res);
            return;
        }
        //MeetingData for meeting by user not found
        result({kind: "not_found"},null);
    });
};
MeetingData.findMeetingDataByMeetingIdAndDataId = (meetingId, dataId, result) => {
    mysql.query(`SELECT * FROM MeetingData WHERE meetingId = ${meetingId} AND dataId = ${dataId}`, (err,res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        if(res.length)
        {
            console.log("MeetingData with meetingId and dataId successfully found ", res);
            result(null, res);
            return;
        }
        //MeetingData for meeting with dataId not found
        result({kind: "not_found"},null);
    });
};
MeetingData.updateByMeetingIdAndDataId = (meetingId, dataId, meeting_data, result) => {
    mysql.query("UPDATE MeetingData SET userid = ?, timeRecorded = ?, filename = ? WHERE meetingId = ? AND dataId = ?",
        [meeting_data.userid, meeting_data.timeRecorded, meeting_data.filename, meetingId, dataId], (err, res) => {
            if(err)
            {
                console.log("ERROR: ", err);
                result(err,null);
                return;
            }
            if (res.affectedRows == 0)
            {
                //MeetingData with meetingId and dataId not found
                result({ kind: "not_found" }, null);
                return;
            }
            console.log("MeetingData info successfully updated\nResult: ",{meetingId: meetingId, dataId: dataId, ...meeting_data});
            result(null, {meetingId: meetingId, dataId: dataId, ...meeting_data});
        });
};
MeetingData.updateFilenameByMeetingIdAndDataId = (meetingId, dataId, filename, result) => {
    mysql.query("UPDATE MeetingData SET filename = ? WHERE meetingId = ? AND dataId = ?",
        [filename, meetingId, dataId], (err, res) => {
            if(err)
            {
                console.log("ERROR: ", err);
                result(err,null);
                return;
            }
            if (res.affectedRows == 0)
            {
                //MeetingData with meetingId and dataId not found
                result({ kind: "not_found" }, null);
                return;
            }
            console.log("MeetingData info successfully updated\nResult: ",{meetingId: meetingId, dataId: dataId, filename: filename});
            result(null, {meetingId: meetingId, dataId: dataId, filename: filename});
        });
};
MeetingData.remove = (meetingId, dataId, result) => {
    mysql.query("DELETE FROM MeetingData WHERE meetingId = ? AND dataId = ?", [meetingId, dataId], (err, res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        if (res.affectedRows == 0)
        {
            //MeetingData with meetingId and dataId not found
            result({ kind: "not_found" }, null);
            return;
        }
        console.log(`Successfully deleted MeetingData with meetingId ${meetingId} and dataId `, dataId);
        result(null, res);
    });
};
MeetingData.removeAllMeetingDataByMeetingId = (meetingId, result) => {
    mysql.query("DELETE FROM MeetingData WHERE meetingId = ?", meetingId, (err, res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        if (res.affectedRows == 0)
        {
            //MeetingData with meetingId not found
            result({ kind: "not_found" }, null);
            return;
        }
        console.log("Successfully deleted MeetingData with meetingId: ", meetingId);
        result(null, res);
    });
};
MeetingData.removeAll = result => {
    mysql.query("DELETE FROM `MeetingData`", (err, res) => {
        if(err)
        {
            console.log("ERROR: ", err);
            result(err,null);
            return;
        }
        console.log(`Deleted MeetingData: ${res.rowsAffected}`);
        result(null, res);
    });
};

module.exports = MeetingData;
