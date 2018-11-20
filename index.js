const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);

server.listen(8080);

app.get('/', function (req, res) {
	res.sendFile(__dirname + "/index.html");
});

io.on('connection', function (socket) {
	console.log("connection");
});
