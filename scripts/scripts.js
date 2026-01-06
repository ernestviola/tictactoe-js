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
      winner: hasWinner()
    }

    function isBoardFull(arr) {
      return arr.flat(Infinity).every(e => e !== null);
    }

    function hasWinner() {
      return checkRows() || checkColumns() || checkDiagonals();

      // check rows
      function checkRows() {
        for (let i = 0; i < gameBoard.length; i++) {
        const currentRow = gameBoard[i];
        if (!currentRow[0]) {
          // if first index of current row is empty then not a row win
          continue;
        }
        const currentSymbol = currentRow[i];
        if (currentRow.every(e => e === currentSymbol)) {
          console.log('Row Win');
          return true;
        }
      }
      }

      // check columns
      function checkColumns() {
        for (let r = 0; r < rows; r++) {
        let columnWin = false;
        let currentSymbol;
        for (let c = 0; c < columns; c++) {
          
          if (c == 0 && gameBoard[0][r]) {
            currentSymbol = gameBoard[0][r];
          }
          if (!currentSymbol) break;

          if (currentSymbol == gameBoard[c][r]) {
            columnWin = true;
          } else {
            columnWin = false;
            break;
          }
        }
        if (columnWin) {
          console.log('Column Win')
          return columnWin;
        }
      }
      }

      // check diagonals
      function checkDiagonals() {
        return checkTopLeftToBottomRight() || checkBottomLeftToTopRight();
        function checkTopLeftToBottomRight() {
          let isWinner = false;
          let currRow = 0;
          let currCol = 0;
          const currentSymbol = gameBoard[currRow][currCol];
          while (currRow < rows && currCol < columns) {
            if (currentSymbol && gameBoard[currRow][currCol] === currentSymbol) {
              isWinner = true;
            } else {
              return false;
            }
            currRow++;
            currCol++;
          }
          return isWinner;
        }
        function checkBottomLeftToTopRight() {
          let isWinner = false;
          let currRow = 0;
          let currCol = columns-1;
          const currentSymbol = gameBoard[currRow][currCol];
          while (currRow < rows && currCol >=0) {
            if (currentSymbol && gameBoard[currRow][currCol] === currentSymbol) {
              isWinner = true;
            } else {
              return false;
            }
            currRow++;
            currCol--;
          }
          return isWinner;
        }
      }
      
    }
  }

  return { getBoard, printBoard, playerTurn, checkBoardState };
}

function playerController() {
  const players = [];
  let currentPlayer = 0;

  const newPlayer = (name, symbol) => {
    // check to see if name or symbol already exists if it does then redo
    let wins = 0;
    const increaseScore = () => wins++;
    if (players.find(player => player.name == name)) {
      throw Error('Name is already in use');
    } else if ((players.find(player => player.symbol == symbol))) {
      throw Error('Symbol is already in use');
    }
    players.push(
      {
        name,
        symbol,
        wins,
        increaseScore
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
  let board = null;
  let winner = null;
  const players = playerController();

  const startGame = () => {
    // create the board
    board = boardController();
    board.printBoard();
  }

  const playRound = (row, column) => {
    if (board.checkBoardState().full) {
      console.log('Unable to continue. Start a new game.');
    }
    if(winner) {
      console.log('Play a new game current winner is:', winner.name)
    }
    if (board.playerTurn(row, column, players.getCurrentPlayer())) {
      board.printBoard();
      const currentBoardState = board.checkBoardState();

      if (currentBoardState.full) {
        console.log('Unable to continue. Start a new game.');
      } else if (currentBoardState.winner) {
        winner = players.getCurrentPlayer();
        winner.increaseScore();
        console.log('Play a new game current winner is:', winner.name);
        console.log(`${winner.name} has a score of ${winner.wins}`);
      } else {
        players.nextPlayer();
      }        
    }
  }

  players.newPlayer('player 1', 'X');
  players.newPlayer('player 2', 'O');

  return { startGame,playRound }
}

const gc = gameController();