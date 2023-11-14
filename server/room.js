class Room {
   constructor(io, roomId) {
      this.roomId = roomId;
      this.players = [];
      this.isFull = false;
      this.io = io;

      this.io.emit("roomCreated", { roomId });
      console.log(`${roomId} room has been created`);
   }

   addPlayer(socket, side) {
      if (this.players.length === 2) {
         this.isFull = true;

         return "room full";
      } else if (this.players.length === 0) {
         socket.join(this.roomId);
         this.players.push({ socket, side });
      } else {
         socket.join(this.roomId);
         this.players.push({ socket, side });

         this.players.forEach((player) => {
            player.socket.emit("roomJoined", {
               roomId: this.roomId,
               side: player.side,
            });
         });
      }
   }

   removePlayer(player) {
      const index = this.players.indexOf(player);
      if (index > -1) {
         this.players.splice(index, 1);
         this.isFull = false;
      }
   }
}

module.exports = Room;
