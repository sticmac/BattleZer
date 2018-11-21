const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const Game = require('./game_engine/Game');
const StandaloneGame = require('./game_engine/StandaloneGame');
const DistributedGame = require('./game_engine/DistributedGame');
const os = require('os');

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

io.on('connection', onConnect);


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

    socket.on('players picks', function(p){
        //verif de si Game est ready et à distribué
        socket.emit('chat message',{code : '203',message : 'server gathered all players picks'})
    });


    socket.on('send cards', function (a) {
        let game = getGameByName(a.game);
        if (game) {
            if (game.isReady) {
                game.distributeCards();
            } else {
                socket.emit('chat message', {
                    code: 406, message: 'game is not ready for this operation'
                })
            }
        } else socket.emit('chat message', {code: 403, message: 'requested game does not exists'})

    });

    socket.on('join game', function (m) {
        if (socket.rooms.hasOwnProperty(m.game)) {
            //le socket est deja dans une game
            socket.emit('chat message', {code: 401, message: 'client already associated to a game'})
        } else {
            //le socket n'est pas encore dans une game
            let game = getGameByName(m.game);
            if (game) {
                if (game.type === 'standalone') {
                    socket.emit('chat message', {
                        code: 402,
                        message: 'game is standalone mode, no other client allowed'
                    });
                } else {
                    socket.join(m.game);
                    game.addPlayer(socket.id)
                }
            } else socket.emit('chat message', {code: 403, message: 'requested game does not exists'})
        }
    });

    socket.on('close game', function (m) {
        let game = getGameByName(m)
        if (game) game.closeGame();
    })


    socket.on('reset games', function (m) {
        console.log('removing all current game (' + games.length + ')');
        for (let i in games) {
            let g = games[i];
            for (let j in g.players) {
                let p = g.players[j]
                io.to(p.id).emit('chat message', {code: 404, message: g.name + ' is over'})

            }
            io.to(g.tableId).emit('chat message', {code: 404, message: g.name + ' is over'})
        }
        games = [];
    });

    socket.on('chat message', function (m) {
        io.emit('chat message', m);
    });
}


function getGameByName(n) {
    let game = null;
    for (let i in games) {
        if (games[i].name === n) {
            game = games[i];
        }
    }
    return game;
}

function isAlreadyInGame(id) {
    for (let i in games) {
        if (games[i].tableId === id) {
            io.to(id).emit('chat message', {code: 401, message: 'client already associated to a game'});
            return true;
        } else return false;
    }
}


http.listen(2727, function () {
    const ifaces = os.networkInterfaces();
    console.log("Running server");
    console.log("Available on:");
    Object.keys(ifaces).forEach(function (dev) {
        ifaces[dev].forEach(function (details) {
            if (details.family === 'IPv4') {
                console.log(('  http://' + details.address + ':2727'));
            }
        });
    });
});

