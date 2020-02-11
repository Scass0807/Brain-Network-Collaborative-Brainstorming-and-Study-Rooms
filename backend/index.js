const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http); //For if and when we are ready to start using socket

app.get('/', (req, res) => {
    res.send('<h1>Hello World</h1>');
});

http.listen(3000, () => {
    console.log("Server Running")
    console.log('listening on *:3000');
});
