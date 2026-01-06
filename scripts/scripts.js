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
      gameBoard[row][column] = player.getSymbol();
      return true;
    }
  }

  const checkBoardState = () => {
    // check if no more moves are possible so all cells have a value
    // check if the winning condition is found if so then return true for the last player
    return {
      isFull: isBoardFull(gameBoard),
      hasWinner: hasWinner()
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
    let playerName = name;
    let playerSymbol = symbol;

    if (players.find(player => player && player.getSymbol() == name)) {
      throw Error('Name is already in use');
    } else if ((players.find(player => player && player.getSymbol() == symbol))) {
      throw Error('Symbol is already in use');
    }

    const getName = () => playerName;
    const setName = (name) => {
      name = name;
    }
    const getSymbol = () => playerSymbol;
    const increaseScore = () => {
      wins++;
      return wins;
    }

    const getWins = () => {
      return wins;
    }

    const player = {
        getName,
        setName,
        getSymbol,
        increaseScore,
        getWins,
        setName
      }

    players.push(
      player
    );

    return player;
  }

  const getCurrentPlayer = () => players[currentPlayer];
  const getAllPlayers = () => players;
  const nextPlayer = () => {
    currentPlayer = (currentPlayer + 1) % players.length;
  }

  return { 
    newPlayer, 
    nextPlayer,
    getCurrentPlayer, 
    getAllPlayers,
  };
}


function gameController() {
  let board = null;
  let winner = null;
  const players = playerController();

  const startGame = () => {
    // create the board
    winner = null;
    board = boardController();
  }

  const playRound = (row, column) => {
    if (board.checkBoardState().full) {
      console.log('Unable to continue. Start a new game.');
      return;
    }
    if(winner) {
      console.log('Can not continue as a winner has been found:', winner.name)
      return;
    }
    if (board.playerTurn(row, column, players.getCurrentPlayer())) {
      const currentBoardState = board.checkBoardState();

      if (currentBoardState.hasWinner) {
        winner = players.getCurrentPlayer();

        console.log(winner.increaseScore())
        console.log('Play a new game current winner is:', winner.getName(), 'with', winner.getWins(), 'wins.');
      } else if (currentBoardState.isFull) {
        console.log('Unable to continue. Start a new game.');
      } else {
        players.nextPlayer();
      }        
    }
  }

  const getBoard = () => board ? board.getBoard() : null;

  const newPlayer = (name,symbol) => players.newPlayer(name,symbol);

  return { newPlayer, startGame, getBoard, playRound }
}

const screenController = () => {
  const gc = gameController();
  const ui_board = document.querySelector('.game_board');
  // set player names
  // show a startgame button which starts the game
  const player_1 = gc.newPlayer('Player 1', 'X');
  const player_2 = gc.newPlayer('Player 2','O');

  const takeTurn = (row,col) => {
    gc.playRound(row,col);
  }

  const writeBoard = () => {
    ui_board.replaceChildren();
    const logic_board = gc.getBoard();

    if (!logic_board) return;

    for (let row = 0; row < logic_board.length; row++) {
      const currentRow = logic_board[row];
      for (let col = 0; col < currentRow.length; col++ ) {
        const currentCell = document.createElement('div');
        currentCell.innerText = logic_board[row][col];
        currentCell.className = 'cell';
        currentCell.dataset.row = row;
        currentCell.dataset.col = col;

        currentCell.addEventListener('click', () => {
          // take a turn
          takeTurn(currentCell.dataset.row, currentCell.dataset.col)
          writeBoard();
        })

        ui_board.appendChild(currentCell);
      }
    }
  }

  const initializeStartGameButton = () => {
    const new_game_button = document.querySelector('.new_game');
    new_game_button.addEventListener('click', (e) => {
      e.preventDefault;
      gc.startGame();
      writeBoard();
    })
  }

  initializeStartGameButton();
  

  return {writeBoard, takeTurn};
}

const sc = screenController();
