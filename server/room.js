class Room {
   constructor(io, roomId) {
      this.roomId = roomId;
      this.players = [];
      this.isFull = false;
      this.io = io;
      // console.log("helll",io)

      // this.io.emit("roomCreated", { roomId })
   }

   addPlayer(socket, side) {
      this.players.push({ socket, side });
      if (this.players.length === 2) {
         this.isFull = true;
      }
      
      socket.emit("joinRoom", {roomId: this.roomId, side});
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
