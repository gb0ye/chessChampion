const WebSocket = require("ws");
const Room = require("../room");
const Game = require("../Game");
const wss = new WebSocket.Server({ port: 8080 });

function generateRoomId() {
   return Math.random().toString(36).substring(2, 7).toUpperCase();
}

const activeRooms = [];

wss.on("connection", (ws) => {
   console.log("WebSocket connection established.");

   ws.send(JSON.stringify("hello from the WebSocket server!"));

   ws.on("message", (message) => {
      const data = JSON.parse(message);

      if (data.type === "createRoom") {
         const roomId = generateRoomId(); // Function to generate a unique room ID
         const room = new Room(roomId);
         const playerId = "white";
         room.addPlayer(ws, playerId);
         activeRooms.push(room);
         const response = { type: "roomCreated", roomId };
         ws.send(JSON.stringify(response));
      }

      let game;
      if (data.type === "joinRoom") {
         const roomId = data.roomId;
         const room = activeRooms.find((r) => r.roomId === roomId);
         //  console.log(room, "found")

         if (room && !room.isFull) {
            game = new Game(roomId, room.players);
            const playerId = "black";
            room.addPlayer(ws, playerId);
            const response = {
               type: "roomJoined",
               roomId,
               players: `${room.players.length}`,
            };

            room.players.forEach((player) => {
               player.ws.send(
                  JSON.stringify({ ...response, playerId: player.playerId })
               );
            });
         } else {
            const response = { type: "roomFull" };
            ws.send(JSON.stringify(response));
         }
      }

      if (data.type === "move") {
         const roomId = data.roomId;
         const room = activeRooms.find((r) => r.roomId === roomId);

         if (room) {
            room.players.forEach((player) => {
               console.log(player.playerId, data.playerId)
               if (player.playerId !== data.playerId) {
                  player.ws.send(
                     JSON.stringify({
                        type: "move",
                        move: data.move,
                        roomId: roomId,
                        playerId:data.playerId
                     })
                  );
               }
            });

            console.log("found");
            // game.handleMove(ws, data.move, data.playerId, data.roomId);
         } else {
            console.log("Not Found");
         }
      }
   });

   ws.on("close", () => {
      console.log("Websocket connection closed");
      // Remove the player from the room and notify other players or end the game if necessary
   });
});
