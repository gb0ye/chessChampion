const express = require("express");
const path = require("path");
const { createServer } = require('node:http');
const socketServer = require("./websocket/socket");

const app = express();
const server = createServer(app);
socketServer.attach(server);

app.use(express.static(path.join(__dirname, '../static')));

app.get("/home", (req, res) => {
   const homePath = path.join(__dirname, "../static/index.html");
   res.sendFile(homePath);
});

server.listen(3000, () => {
   console.log("server is running on port localhost:3000");
});
