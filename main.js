const { Chess } = require('chess.js')


function onChange (oldPos, newPos) {
    console.log('Position changed:')
    console.log('Old position: ' + Chessboard.objToFen(oldPos))
    console.log('New position: ' + Chessboard.objToFen(newPos))
    console.log('~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~')
  }

  function onDragStart (source, piece, position, orientation) {
    // do not pick up pieces if the game is over
    if (game.game_over()) return false
  
    // only pick up pieces for the side to move
    if ((game.turn() === 'w' && piece.search(/^b/) !== -1) ||
        (game.turn() === 'b' && piece.search(/^w/) !== -1)) {
      return false
    }
  }

 var chessBoardConfig = {
    draggable: true,
    position: "start",
    onChange: onChange,
    onDragStart: onDragStart
 };


 module.exports = {chessBoardConfig}