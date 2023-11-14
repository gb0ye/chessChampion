const socketServer = require("socket.io")();
const Room = require("../room");

class GameServer {
   constructor(socketServer) {
      // this.io = socketServer.attach(server);
      this.io = socketServer;
      this.rooms = [];

      this.io.on("connect", (socket) => {
         console.log("connection made from bot");
         socket.on("createRoom", async () => {
            const roomId = generateRoomId();
            // console.log(this.io);
            // const room = new Room(this.io, roomId);
            // this.rooms.push(room);
         });

         socket.on("joinRoom", (data) => {
            const roomId = data.roomId;
            const side = data.side;
            const room = this.rooms.find((r) => r.roomId === roomId);

            if (room && !room.isFull) {
               room.addPlayer(socket, side);
               room.players.forEach((player) => {
                  player.socket.emit("roomJoined", {
                     roomId,
                     side: player.side,
                  });
               });
               console.log(`${side} just joined the room`);
            } else {
               socket.emit("roomFull", { msg: "Room is full. Cannot join." });
            }
         });

         socket.on("move", (data) => {
            const roomId = data.roomId;
            const room = this.rooms.find((r) => r.roomId === roomId);

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

         socket.on("tgInitDataUnsafe", (data) => {
            console.log("server recieved tg data");
            const roomId = data["start_param"];

            if (roomId) {
               const room = this.rooms.find((r) => r.roomId === roomId);
               if (room) {
                  console.log("room was found");
                  this.addPlayerToRoom(socket, { room });
               } else {
                  console.log("room was not found");
                  const newRoom = new Room(this.io, roomId);
                  this.rooms.push(newRoom);
                  this.addPlayerToRoom(socket, { room: newRoom });
               }
            }
         });

         socket.on("disconnect", () => {
            console.log("user disconnected");
         });
      });
   }

   createRoom = () => {
      const room = new Room(this.io, generateRoomId());
      this.rooms.push(room);
      return room;
   };

   addPlayerToRoom = (socket, data) => {
      // console.log(data.newRoom)
      const roomId = data.room.roomId;
      const room = this.rooms.find((r) => {
         // console.log(r.roomId, roomId);
         if (r.roomId === roomId) return r;
      });
      if (room) {
         room.players.length === 0
            ? room.addPlayer(socket, "white")
            : room.addPlayer(socket, "black");
      } else {
         console.log("No room available");
      }
   };
}

function generateRoomId() {
   return Math.random().toString(36).substring(2, 7).toUpperCase();
}

module.exports = GameServer;
