import { Chess } from "./chess.js";
const createRoomBtn = document.getElementById("createRoom");
const joinRoomBtn = document.getElementById("joinRoom");
const roomForm = document.querySelector("#roomForm");
const socket = io();

let board;
let game;

socket.on("message", (data) => {
   if (data === "roomCreated") {
      console.log("roomId: " + data.roomId);
   }

   if (data.type === "move") {
   }

   if (data.type === "roomJoined") {
   } else {
      console.log(data);
   }
});

socket.on("roomCreated", (data) => {
   console.log("room created", data);
});

socket.on("roomJoined", (data) => {
   console.log("room jonied", data);

   const roomId = data.roomId;
   game = new Chess();
   const player = data.side;

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
         game.move({
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

      socket.emit("move", {
         move: { source, target },
         side: data.side,
         roomId: roomId,
      });

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
});

socket.on("roomFull", (data) => {
   console.log("room", data.msg);
});

socket.on("move", (data) => {
   const moves = data.move;
   game.move(`${moves.source}-${moves.target}`);
   board.move(`${moves.source}-${moves.target}`);
});

//////////////////////////////	EVENT LISTENERS		////////////////////////////////////////
createRoomBtn.addEventListener("click", (e) => {
   socket.send(JSON.stringify({ type: "createRoom" }));
   socket.emit("createRoom");
});

roomForm.addEventListener("submit", function (event) {
   event.preventDefault(); // Prevent form submission

   const roomCodeInput = document.querySelector("#roomCode");
   const roomCode = roomCodeInput.value;
   roomCodeInput.value = "";

   socket.emit("joinRoom", roomCode);
});

const dummyTgInitData = {
   auth_date: "1699973669",
   chat_instance: "4630571020885558203",
   chat_type: "private",
   hash: "d4f5022e468cfb36ce67a37129153d84caeb9e69ab5581e70eebfbc5b9ce23e0",
   start_param: "75ZTI",
   user: {
      id: 1173903586,
      first_name: "Daniel ◉⁠‿⁠◉",
      last_name: "",
      username: "gb0ye",
   },
};

const tgInitData = Telegram.WebApp.initDataUnsafe;

if (tgInitData && Object.keys(tgInitData).length !== 0) {
   socket.emit("tgInitDataUnsafe", { tgInitData });
   console.log(`tg data was found, sent emit`)
   console.log(Object.keys(tgInitData).length)
} else {
   socket.emit("tgInitDataUnsafe", { ...dummyTgInitData });
   console.log(`tg data was not found, supposed sent emit`)
}
