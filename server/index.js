const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Game = require('./game_engine/Game');
const StandaloneGame = require('./game_engine/StandaloneGame');
const DistributedGame = require('./game_engine/DistributedGame');

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connect', onConnect);


let games = [];


function onConnect(socket) {

    socket.on('start game', function (p) {
        //ce socket correspond à la table

        if (!isAlreadyInGame(socket.id)) {

            let game;
            let roomName = 'gameroom#' + (games.length + 1);
            socket.join(roomName);

            if (p.type === 'standalone') {
                game = new StandaloneGame(roomName, p.players, socket.id, io);
            } else {
                game = new DistributedGame(roomName, p.players, socket.id, io);
            }

            games.push(game);
        }

    });

    socket.on('join game', function(m){

        //todo : test if already in game
        //todo first : fix join problem (socket.emit not working)
        let id = socket.id;
        let game = null;
        for(let i in games){
            if(games[i].name === m){
              game = games[i];
            }
        }

        if(game){
            if(game.type === 'standalone'){
                console.log('game not accepting smartphone client');
                game.sendToTable("game not accepting smartphone client")
            } else {
                console.log(id+' joining '+game.name+' - '+game.type);
                game.addPlayer(id);
            }
        }

    });


    socket.on('reset games', function (m) {
        console.log('removing all current game ('+games.length+')');
        games = [];
    });

    socket.on('chat message', function (m) {
        io.emit('chat message', m);
    });
}

function isAlreadyInGame(id) {
    for (let i in games) {
        if (games[i].tableId === id) {
            io.to(id).emit('chat message', 'tu as deja commencé une game pd')
            return true;
        } else return false;
    }
}


io.on('connection', function (socket) {

});

http.listen(2727, function () {
    console.log('listening on *:2727');
});

