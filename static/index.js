import { Chess } from "../dist/esm/chess.js";
const createRoomBtn = document.getElementById("createRoom");
const joinRoomBtn = document.getElementById("joinRoom");
const roomForm = document.querySelector("#roomForm");
const socket = new WebSocket("ws://localhost:8080");

let board;
let game;

socket.addEventListener("message", (event) => {
   const data = JSON.parse(event.data);
   let moves;
   let player;

   if (data.type === "roomCreated") {
      console.log("roomId: " + data.roomId);
   }

   if (data.type === "move") {
      moves = data.move;
      console.log(game.turn());
      game.move(`${moves.source}-${moves.target}`);
      board.move(`${moves.source}-${moves.target}`);
   }

   if (data.type === "roomJoined") {
      const roomId = data.roomId;
      game = new Chess();
      player = data.playerId;


      var whiteSquareGrey = "#a9a9a9";
      var blackSquareGrey = "#696969";
      var $board = $("#board");

      function makeRandomMove() {
         var possibleMoves = game.moves({
            verbose: true,
         });

         // game over
         if (possibleMoves.length === 0) return;

         var randomIdx = Math.floor(Math.random() * possibleMoves.length);
         var move = possibleMoves[randomIdx];
         game.move(move.san);

         // highlight black's move
         // removeHighlights('black')
         $board.find(".square-" + move.from).addClass("highlight-black");
         // squareToHighlight = move.to

         // update the board to the new position
         board.position(game.fen());
      }

      function removeGreySquares() {
         $("#board .square-55d63").css("background", "");
      }

      function greySquare(square) {
         var $square = $("#board .square-" + square);

         var background = whiteSquareGrey;
         if ($square.hasClass("black-3c85d")) {
            background = blackSquareGrey;
         }

         $square.css("background", background);
      }

      function onDragStart(source, piece, position, orientation) {
         // do not pick up pieces if the game is over
         if (game.isGameOver()) return false;

         // or if it's not that side's turn

         // if(orientation)
         console.log(orientation, player, piece, game.turn());
         const lol = game.turn() === player[0] && piece.search(/^b/) === -1;
         console.log(lol);

         if (
            (orientation === "white" && piece.search(/^w/) === -1) ||
            (orientation === "black" && piece.search(/^b/) === -1)
         ) {
            return false;
         }

         if (
            (game.turn() === "w" && piece.search(/^b/) !== -1) ||
            (game.turn() === "b" && piece.search(/^w/) !== -1)
         ) {
            return false;
         }
      }

      function onDrop(source, target) {
         removeGreySquares();

         // see if the move is legal
         try {
            const move = game.move({
               from: source,
               to: target,
            });
            // console.log(move);
         } catch (error) {
            if (!error.message.includes("Invalid move")) {
               console.log(error);
            }
            return "snapback";
         }

         socket.send(
            JSON.stringify({
               type: "move",
               move: { source, target },
               playerId: player,
               roomId: roomId,
            })
         );

         // window.setTimeout(makeRandomMove, 250);
      }

      function onMouseoverSquare(square, piece) {
         // get list of possible moves for this square
         var moves = game.moves({
            square: square,
            verbose: true,
         });

         // exit if there are no moves available for this square
         if (moves.length === 0) return;

         // highlight the square they moused over
         greySquare(square);

         // highlight the possible squares for this piece
         for (var i = 0; i < moves.length; i++) {
            greySquare(moves[i].to);
         }
      }

      function onMouseoutSquare(square, piece) {
         removeGreySquares();
      }

      function onSnapEnd() {
         board.position(game.fen());
      }

      const chessBoardConfig = {
         draggable: true,
         position: "start",
         onDragStart: onDragStart,
         onMouseoverSquare: onMouseoverSquare,
         onMouseoutSquare: onMouseoutSquare,
         onDrop: onDrop,
         onSnapEnd: onSnapEnd,
         orientation: player,
      };

      board = Chessboard("board", chessBoardConfig);

      board.start();

   } else {
      console.log(event.data);
   }
});

createRoomBtn.addEventListener("click", (e) => {
   socket.send(JSON.stringify({ type: "createRoom" }));
});

roomForm.addEventListener("submit", function (event) {
   event.preventDefault(); // Prevent form submission

   const roomCodeInput = document.querySelector("#roomCode");
   const roomCode = roomCodeInput.value;
   roomCodeInput.value = "";

   socket.send(JSON.stringify({ type: "joinRoom", roomId: roomCode }));
});
