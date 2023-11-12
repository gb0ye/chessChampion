const io = require("socket.io")();
const Room = require("../room");

const activeRooms = [];

io.on("connection", (socket) => {
   console.log("a user connected");
   socket.emit("message", "hello from server side");

   socket.on("createRoom", async () => {
      const roomId = generateRoomId();
      const room = new Room(roomId);

      room.addPlayer(socket, "white");
      activeRooms.push(room);
      socket.emit("roomCreated", { roomId });
   });

   socket.on("joinRoom", (roomId) => {
      const room = activeRooms.find((r) => r.roomId === roomId);

      if (room && !room.isFull) {
         const side = "black";

         room.addPlayer(socket, side);
         room.players.forEach((player) => {
            player.socket.emit("roomJoined", { roomId, side: player.side });
         });
      } else {
         socket.emit("roomFull", { msg: "Room is full. Cannot join." });
      }
   });

   socket.on("move", (data) => {
      const roomId = data.roomId;
      const room = activeRooms.find((r) => r.roomId === roomId);

      if (room) {
         room.players.forEach((player) => {
            if (player.side !== data.side) {
               player.socket.emit("move", {
                  move: data.move,
                  roomId: roomId,
                  playerId: data.playerId,
               });
            }
         });

         // game.handleMove(ws, data.move, data.playerId, data.roomId);
      } else {
         console.log("Room Not Found");
      }
   });

   socket.on("disconnect", () => {
      console.log("user disconnected");
   });
});

function generateRoomId() {
   return Math.random().toString(36).substring(2, 7).toUpperCase();
}

module.exports = io;
