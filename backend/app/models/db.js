const mysql = require("mysql");
const dbConfig = require("../config/db.config.js");

//Initialize db models
const db = mysql.createConnection({
   host: dbConfig.HOST,
   user: dbConfig.USER,
   password: dbConfig.PASSWORD,
   database: dbConfig.DB
});

//open models to MySQL db
db.connect(error => {
    if(error)
        throw error;
    console.log("Successfully connected to db");
});
module.exports = db;
