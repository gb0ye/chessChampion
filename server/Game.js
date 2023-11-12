const { Chess } = require("chess.js");
class Game {
   constructor(roomId, players) {
      this.roomId = roomId;
      this.players = players;
      this.gameState = {};
      this.game = new Chess();
   }

   handleMove(player, move) {
      if (player === this.players[0]) {
         this.game.move(move);
         this.players[1].send(JSON.stringify({ type: "move", move }));
      } else {
         this.game.move(move);
         this.players[0].send(JSON.stringify({ type: "move", move }));
      }
   }

   getMoves(square, piece) {
      const moves = this.game.moves({
         square: square,
         verbose: true,
      });

      return moves;
   }

   getMovePossible(from, target) {
      const move = this.game.move({
         from: from,
         target: target,
      });
   }

   endGame(winner) {}
}

module.exports = Game;
