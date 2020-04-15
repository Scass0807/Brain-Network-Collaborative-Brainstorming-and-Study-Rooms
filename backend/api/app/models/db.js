const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");

//Initialize db models
const pool = mysql.createPool({
   host: dbConfig.HOST,
   user: dbConfig.USER,
   password: dbConfig.PASSWORD,
   database: dbConfig.DB
});

module.exports = {
    query:  function () {
        const sqlQuery = arguments[0];
        var queryArgs = [];
        var cb = arguments[arguments.length - 1];

        pool.getConnection((err, connection) => {
            if (err) {
                console.log(err);
                cb(err);
                return;
            }
            if (arguments.length > 2) {
                queryArgs = arguments[1];
            }
            connection.query(sqlQuery, queryArgs, (err, res) => {
                connection.release();
                if (err) {
                    console.log(err);
                    cb(err);
                    return;
                }
                cb(null, res);
            });
        });
    }
};
