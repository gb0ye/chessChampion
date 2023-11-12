class Room {
   constructor(roomId) {
      this.roomId = roomId;
      this.players = [];
      this.isFull = false;
   }

   addPlayer(socket, side) {
      this.players.push({socket, side});
      if (this.players.length === 2) {
         this.isFull = true;
      }
      socket.join(this.roomId)
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