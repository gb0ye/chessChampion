const express = require("express");
const path = require("path");
const { createServer } = require("node:http");
const socketServer = require("./websocket/socket");
const { chessChampion } = require("./Telegram/ChessChampion");
const GameServer = require("./Telegram/gameSever");


const app = express();
const server = createServer(app);
socketServer.attach(server);

app.use(express.static(path.join(__dirname, "../static")));

app.get("/home", (req, res) => {
   const homePath = path.join(__dirname, "../static/index.html");
   res.sendFile(homePath);
});

const port = process.env.PORT || 3000;

const gameServer = new GameServer(socketServer)
const bot = new chessChampion(gameServer);

server.listen(port, () => {
   const address = server.address();
   const hostname = address.address;
   console.log(`Server is running on http://${hostname}:${address.port}`);
});

bot.lanuch();
