const express = require("express");
const path = require("path");
const { createServer } = require("node:http");
const socketServer = require("./websocket/socket");

const app = express();
const server = createServer(app);
socketServer.attach(server);

app.use(express.static(path.join(__dirname, "../static")));

app.get("/home", (req, res) => {
   const homePath = path.join(__dirname, "../static/index.html");
   res.sendFile(homePath);
});

const port = process.env.PORT || 3000;

server.listen(port, () => {
   console.log("server is running on port localhost:3000");
});
