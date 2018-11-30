
function initGame(gameId) {
    const Controller = require('./Controller');

    const controller = new Controller(gameId);
}

document.addEventListener("DOMContentLoaded", function() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('gameid') !== null) {
        document.getElementById("sendGameId").style = "display: none";
        console.log(urlParams.get('gameid'));
        initGame(urlParams.get('gameid'));
    } else {
        document.getElementById("sendGameId").style = "display: block";
    }
});