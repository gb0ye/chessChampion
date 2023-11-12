class Room {
   constructor(roomId) {
      this.roomId = roomId;
      this.players = [];
      this.isFull = false;
   }

   addPlayer(ws, playerId) {
      this.players.push({ws, playerId});
      if (this.players.length === 2) {
         this.isFull = true;
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