/*
  The Battleship class is a class which sets up the battleship game, constrains
  all the classical battleship rules, and manages the displaying of the boards
  and notifications related to the game.
*/

class Battleship {
  constructor(height, width) {
    this.playerBoard1 = new Board(height, width);
    this.playerBoard2 = new Board(height, width);
    this.isPlayer1Turn = true;
    // Randomize Ships

    this.height = height;
    this.width = width;
    this.state = "lobby";
  }

  /*
    The startGame() function will prepare the game for playing.
  */
  startGame() {
    this.state = "playing";
    this.playerBoard2.toggleVisible();
    this.showNotification("The game has started", "It is " + this.getPlayerTurn() + "'s turn");
  }

  /*
    The randomizeShips() function will randomly place ships onto each player's
    board. This function will place 2 line ships, 1 box ship, and 1 L ship on
    each board.
  */
  randomizeShips() {

    // Add two Line Ships onto player 1's board
    var shipCount = 0;
    while (shipCount < 2) {
      var ship = new ShipLine();
      ship.randomizeShip(this.height, this.width);
      var success = this.playerBoard1.addShip(ship);
      if (success) {
        shipCount++;
      }
    }

    // Add two Line Ships onto player 2's board
    var shipCount = 0;
    while (shipCount < 2) {
      var ship = new ShipLine();
      ship.randomizeShip(this.height, this.width);
      var success = this.playerBoard2.addShip(ship);
      if (success) {
        shipCount++;
      }
    }

    // Add one Box Ship onto player 1's board
    var shipCount = 0;
    while (shipCount < 1) {
      var ship = new ShipBox();
      ship.randomizeShip(this.height, this.width);
      var success = this.playerBoard1.addShip(ship);
      if (success) {
        shipCount++;
      }
    }

    // Add one Box Ship onto player 2's board
    var shipCount = 0;
    while (shipCount < 1) {
      var ship = new ShipBox();
      ship.randomizeShip(this.height, this.width);
      var success = this.playerBoard2.addShip(ship);
      if (success) {
        shipCount++;
      }
    }

    // Add one L Ship onto player 1's board
    var shipCount = 0;
    while (shipCount < 1) {
      var ship = new ShipL();
      ship.randomizeShip(this.height, this.width);
      var success = this.playerBoard1.addShip(ship);
      if (success) {
        shipCount++;
      }
    }

    // Add one L Ship onto player 2's board
    var shipCount = 0;
    while (shipCount < 1) {
      var ship = new ShipL();
      ship.randomizeShip(this.height, this.width);
      var success = this.playerBoard2.addShip(ship);
      if (success) {
        shipCount++;
      }
    }
  }

  /*
    The updateDisplay() function will update the user interface of the boards.
  */
  updateDisplay() {
    $("#player1").empty();
    $("#player2").empty();

    $("#player1").append(this.playerBoard1.makeTable());
    $("#player2").append(this.playerBoard2.makeTable());
  }

  /*
    The shoot() function allows a player to 'shoot' at the opposing board.
    It will grab the state of the cell shot at, then replace the cell with the
    result. In addition, it will show a notification to the user on the
    resulting action.

    Empty cells "E" will turn into Miss cells "M"
    Ship cells "S" will turn into Hit cells "H"
  */
   shoot(i, j) {
    var board = this.getOppositionBoard();
    var s = board.getCell(i, j);
    console.log("cell at " + i + j + " is " + s);

    // If the cell shot at contains a Ship "S", replace with a Hit "H"
    if (s == "S") {
      board.setCell(i, j, "H");
      var winner = this.checkWinner();

      // Notify player of a winner if one person has sunk all opposing ships.
      if (winner) {
        this.showWinNotification(this.getPlayerTurn() + " has won!", this.getPlayerTurn() + " has sunk all opposing ships.");
        this.playerBoard1.setVisible(false);
        this.playerBoard2.setVisible(false);
        this.state = "ended";

      // Notify player that they hit a ship and change turns.
      } else {
        this.changeTurn();
        var shipSunkText = "";
        var shipType = board.sunkShip(i, j);

        if (shipType != null) {
          shipSunkText = " You have sunk a " + shipType + "!";
        }

        this.showNotification("Shot hit!", "You hit a ship!" + shipSunkText + " It is now " + this.getPlayerTurn() + "'s turn!");
      }
        this.updateDisplay();

    // If the cell shot at is Empty "E", replace it with a Miss "M".
    } else if (s == "E") {
      board.setCell(i, j, "M");
      this.changeTurn();
      this.updateDisplay();
      this.showNotification("Shot missed!", "You did not hit any ships! It is now " + this.getPlayerTurn() + "'s turn!");

    //The cell is already Hit "H" or Miss "M".
    } else {
      this.showNotification("Cell has already been shot at.", "You have already shot at this cell. Choose a different cell.");
    }
  }

  /*
    The showNotification() function is a helper function which will show a
    modal notification with the given text.
  */
  showNotification(title, body) {
    $("#battleship-modal-title").html(title);
    $("#battleship-modal-body").html(body);
    $("#battleship-modal").modal("show");
  }

  /*
    The showWinNotification() function is a helper function which will show a
    modal notification with the given text. In addition, it will update the final
    statistics of each player.
  */
  showWinNotification(title, body) {
    $("#battleship-win-modal-title").html(title);
    $("#battleship-win-modal-body").html(body);
    $("#battleship-win-p1-num-shots").html(this.playerBoard2.numShots());
    $("#battleship-win-p2-num-shots").html(this.playerBoard1.numShots());
    $("#battleship-win-p1-ships-sank").html(this.playerBoard2.numShipsSunk());
    $("#battleship-win-p2-ships-sank").html(this.playerBoard1.numShipsSunk());
    $("#battleship-win-modal").modal("show");
  }

  /*
    The checkWinner() function will check each player's board if all of their
    ships has been sunk.
    It will return true if either player has no ships.
    Otherwise it will return false;
  */
  checkWinner() {
    if (this.isPlayer1Turn) {
      if (this.playerBoard2.allShipsShot()) {
        return true;
      }

    } else {
      if (this.playerBoard1.allShipsShot()) {
        return true;
      }
    }

    return false;
  }

  /*
    The getOppositionBoard() function will return the opposing board of the
    player who's turn it currently is.
  */
  getOppositionBoard() {
    if (this.isPlayer1Turn) {
      return this.playerBoard2;
    }
    return this.playerBoard1;
  }

  /*
    The changeTurn() function will change the turn from current player to the
    other player.
  */
  changeTurn() {
    this.isPlayer1Turn = !this.isPlayer1Turn;
    this.playerBoard1.toggleVisible();
    this.playerBoard2.toggleVisible();
  }

  /*
    The getPlayerTurn() function will return a String representation of who's
    turn it is.
  */
  getPlayerTurn() {
    if (this.isPlayer1Turn) {
      return "Player 1";
    }
    return "Player 2";
  }

  /*
    The getState() function will return the state of the game.
  */
  getState() {
    return this.state;
  }

  /*
    The loadJSON() function will set data given a json object.
  */
  loadJSON(json) {
    this.playerBoard1.loadJSON(json.playerBoard1);
    this.playerBoard2.loadJSON(json.playerBoard2);

    this.isPlayer1Turn = json.isPlayer1Turn;

    this.height = json.height;
    this.width = json.width;
    this.state = json.state;
  }
}
