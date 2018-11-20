const express = require('express');
const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);
const os = require('os');	
const prompt = require('prompt');

server.listen(8080, function() {
	// Display available adresses
	const ifaces = os.networkInterfaces();
	console.log("Running server");
	console.log("Available on:");
	Object.keys(ifaces).forEach(function (dev) {
		ifaces[dev].forEach(function (details) {
			if (details.family === 'IPv4') {
				console.log(('  http://' + details.address + ':8080'));
			}
		});
	});
});

app.get('/', function (req, res) {
	res.sendFile(__dirname + "/index.html");
});

io.on('connection', function (socket) {
	console.log("connection");
	socket.emit('client', {data: "Data recieved!"});
	prompt.start();
	sendUserContentSocket(socket);
});

function sendUserContentSocket(socket) {

	prompt.get('data', function(err, result) {
		if (result.data !== 'exit') {
			socket.emit('client', {data: result.data});
			sendUserContentSocket(socket);
		}
	});

}

