const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);
const prompt = require('prompt');

server.listen(8080);

app.get('/', function (req, res) {
	res.sendFile(__dirname + "/index.html");
});

io.on('connection', function (socket) {
	console.log("connection");
	socket.emit('client', {data: "Data recieved!"});
	prompt.start();

	prompt.get('data', function(err, result) {
		socket.emit('client', {data: result.data});
	});
});

