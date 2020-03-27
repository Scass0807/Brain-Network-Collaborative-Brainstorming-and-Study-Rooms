const express = require('express');
const http = require('http');
const io = require('socket.io')(http); //For if and when we are ready to start using socket
const bodyParser = require("body-parser");

const app = express();

//parse json
app.use(bodyParser.json());

//parse url encoded requests
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({message: "Welcome to Brain Network server"})
});

const routes = require("./app/routes/routes.js")(app);

app.listen(3000, () => {
    console.log("Server Running")
    console.log('listening on *:3000');
});
