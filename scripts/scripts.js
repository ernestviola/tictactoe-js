// create a gameboard
// setNewGameBoardState
// check if gameBoard is in a final state -> won or no moves available
// printBoard

// set player name and token and numberOfWins

// start the game
// player turn -> player turn next
// check board for game state end -> if winner increment player wins


function boardController() {
  const rows = 3;
  const columns = 3

  const gameBoard = new Array(rows).fill(null).map(
    () => new Array(columns).fill(null)
  );

  const getBoard = () => gameBoard;

  // for console debugging print the gameboard
  const printBoard = () => {
    console.log('____Game____');
    for (let i = 0; i < gameBoard.length; i++) {
      console.log(...gameBoard[i])
    }
    console.log('____________');
  }

  const playerTurn = (row, column, player) => {
    // add a token to the board
    if (gameBoard[row][column]) {
      return false;
    } else {
      gameBoard[row][column] = player.symbol;
      return true;
    }
  }

  const checkBoardState = () => {
    // check if no more moves are possible so all cells have a value
    // check if the winning condition is found if so then return the winner token
    return {
      full: isBoardFull(gameBoard),
      winner: checkWinner()
    }

    function isBoardFull(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (Array.isArray(arr[i])) {
          return isBoardFull(arr[i]);
        } else {
          return i==arr.length -1 && arr[i] !== null; 
        }
      }
    }

    function checkWinner() {
      // check rows
      for (let i = 0; i < gameBoard.length; i++) {
        const currentRow = gameBoard[i];
        if (!currentRow[i]) {
          continue;
        }
        const currentSymbol = currentRow[i];
        if (currentRow.every(e => e === currentSymbol)) {
          return true;
        }
      }
      // check columns
      for (let i = 0; i < gameBoard.length; i++) {

      }
      // check diagonals
    }
  }

  return { getBoard, printBoard, playerTurn, checkBoardState };
}

function playerController() {
  const players = [];
  let currentPlayer = 0;

  const newPlayer = (name, symbol) => {
    // check to see if name or symbol already exists if it does then redo
    if (players.find(player => player.name == name)) {
      throw Error('Name is already in use');
    } else if ((players.find(player => player.symbol == symbol))) {
      throw Error('Name is already in use');
    }
    players.push(
      {
        name,
        symbol,
        wins: 0
      }
    );
  }

  const getCurrentPlayer = () => players[currentPlayer];

  const nextPlayer = () => {
    currentPlayer = (currentPlayer + 1) % players.length;
  }

  return { newPlayer, getCurrentPlayer, nextPlayer };
}


function gameController() {
  let board = boardController();
  const players = playerController();

  const startGame = () => {
    // create the board
    board = boardController();
    board.printBoard();
  }

  const playRound = (row, column) => {
    if (board.playerTurn(row, column, players.getCurrentPlayer())) {
      players.nextPlayer();
      board.printBoard();

      if (board.checkBoardState().full) {
        console.log('Full')
      }
    }
  }

  players.newPlayer('player 1', 'X');
  players.newPlayer('player 2', 'O');

  startGame();

  return { startGame,playRound }
}

const gc = gameController();

gc.playRound(0,0);
gc.playRound(0,1);
gc.playRound(0,2);

gc.playRound(1,0);
gc.playRound(1,1);
gc.playRound(1,2);

gc.playRound(2,0);
gc.playRound(2,1);
gc.playRound(2,2);
