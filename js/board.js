/*
  The Board class holds the board for a single player. It will use
  a nested Array in order to track the location of ships, hit shots, and
  missed shots.
*/

class Board {
  constructor(height, width) {
    // Fill a size heightxwidth board with empty representation.
    this.board = [];
    for (var i = 0; i < height; i++) {
      var row = [];
      for (var j = 0; j < width; j++) {
        row.push("E");
      }
      this.board.push(row)
    }

    this.height = height;
    this.width = width;
    this.isVisible = false;
    this.ships = [];
  }

  /*
    The makeTable() function creates a HTML table to display.
  */
  makeTable() {
    var borderStyle = "";

    if (this.isVisible) {
      borderStyle = "cell-visible";

    } else {
      borderStyle = "cell-invisible";
    }

    var table = document.createElement("table");

    // The table created includes the coordinates.
    for (var i = 0; i <= this.height; i++) {
      var row = document.createElement("tr");

      for (var j = 0; j <= this.width; j++) {
        var cell = this.makeCell(i, j);
        cell.classList.add(borderStyle);
        row.appendChild(cell);
      }

      table.appendChild(row);
    }

    return table;
  }

  /*
    The makeCell function will compile an object related to a cell. This will
    include what the cell's text is, and what color it should be.
  */
  makeCell(i, j) {
    var cell = document.createElement("td");


    if (i == 0 && j == 0) {
        // Top-left corner cell. No color or text.

    } else if (i == 0 && j != 0) {
      // Display alphabet coordinates on the top row.
      var char = String.fromCharCode(65 + j - 1);
      cell.innerHTML = char;
      cell.classList.add("heading");

    } else if (i != 0 && j == 0) {
      // Display numerical coordinates on the first column
      cell.innerHTML = i;
      cell.classList.add("heading");

    } else if (i != 0 && j != 0){
      // Go to board and find out if it is already shot, is the player's turn,
      // or what to display
      var char = this.getCell(i - 1, j - 1);
      cell.classList.add(this.getCellStyle(char));
      cell.innerHTML = "&#9679"
      //a.innerHTML = "" + (i - 1) + (j - 1);

      // If the board is ment to be visible, the include a click function for shooting.
      if (this.isVisible) {
        cell.addEventListener("click", function() {
          shoot(i - 1,j - 1);
        });
      }

    } else {
      console.log("Out of bounds cell" + i + ", " + j);
    }

    return cell;
  }

  /*
    The getCellStyle() function will return a color coded keyword depending on what
    the state of the cell is and if certain information should be hidden. The keyword
    is defined in the .css file.
  */
  getCellStyle(char) {
      if (char == "E") {
        return "empty";
      }
      if (char == "M") {
        return "miss";
      }
      if (char == "H") {
        return "hit";
      }
      if (char == "S" && !this.isVisible) {
        return "ship";
      }
      if (char == "S" && this.isVisible) {
        return "empty";
      }
  }

  /*
    The setCell() function will set the character to the location of the board.
  */
  setCell(i, j, char) {
    this.board[i][j] = char;
  }
  /*
    The getCell() function will return the character of the location on the board.
  */
  getCell(i, j) {
    return this.board[i][j];
  }

  /*
    The toggleVisible() function will flip the visibility boolean.
  */
  toggleVisible() {
    this.isVisible = !this.isVisible;
  }

  /*
    The setVisible() function will set the visibility to the given boolean.
  */
  setVisible(isVisible) {
    this.isVisible = isVisible;
  }

  /*
    The sunkShip() function will return the type of the ship which has been
    sunk occupying the given coordinates.
    If there is no ship occupying the location, or the ship is not sunk, it will
    return null.
  */
  sunkShip(i, j) {
    for (var s = 0; s < this.ships.length; s++) {
      var ship = this.ships[s];

      // Check each ship if it occupies the given location.
      if (ship.occupies(i, j)) {
        var shipArea = ship.getArea();

        // Check the area of the ship if the ship is completely sunken
        for (var k = 0; k < shipArea.length; k++) {
          var area = shipArea[k];
          if (this.getCell(area.y, area.x) != "H") {
            return null;
          }
        }

        return ship.getType();
      }
    }
    return null;
  }

  /*
    The addShip() function will check if the given ship can fit on the board.
    If it can, it will add the ship to the board and return true.
    otherwise, it will return false.
  */
  addShip(ship) {
    try {
      var shipArea = ship.getArea();

      // Check if the given ship will fit on the board by determining if it is
      // outside the range of the board.
      for (var i = 0; i < shipArea.length; i++) {
        var area = shipArea[i];

        if (area.y > this.height || area.x > this.width) {
          return false;
        }

        var char = this.getCell(area.y, area.x);

        if (char != "E") {
          return false;
        }
      }

      // Modify the area of the board which the ship will occupy with an "S"
      for (var i = 0; i < shipArea.length; i++) {
        var area = shipArea[i];
        this.setCell(area.y, area.x, "S");
      }

      this.ships.push(ship);
      return true;

    } catch (e) {
      return false;
    }
  }

  /*
    The allShipsShot() function will determine if all ships on the board has been sunk.
    It will return true if all ships are sunk.
    otherwise it will return false.
  */
  allShipsShot() {
    for (var i = 0; i < this.height; i++) {
      for (var j = 0; j < this.width; j++) {

        if (this.getCell(i, j) == "S") {
          return false;
        }
      }
    }
    return true;
  }

  /*
    The numShipsSunk() function will return the count of the number of ships
    which have been sunk.
  */
  numShipsSunk() {
    var numShipsSunk = 0;

    for (var s = 0; s < this.ships.length; s++) {
      var isSunk = true;
      var ship = this.ships[s];
      var shipArea = ship.getArea();

      for (var i = 0; i < shipArea.length; i++) {
        var area = shipArea[i];
        var char = this.getCell(area.y, area.x);
        if (char != "H") {
          isSunk = false;
        }
      }

      if (isSunk) {
        numShipsSunk++;
      }
    }

    return numShipsSunk;
  }

  /*
    The numShots() function will return the count of the number of shots on
    the board.
  */
  numShots() {
    var numShots = 0;
    for (var i = 0; i < this.height; i++) {
      for (var j = 0; j < this.width; j++) {
        if (this.getCell(i, j) == "H" || this.getCell(i, j) == "M") {
          numShots++;
          console.log(i +" "+ j + " is " + this.getCell(i, j));
        }
      }
    }
    return numShots;
  }

  /*
    The loadJSON() function will set data given a json object.
  */
  loadJSON(json) {
    this.board = json.board;
    this.height = json.height;
    this.width = json.width;
    this.isVisible = json.isVisible;

    for (var i = 0; i < json.ships.length; i++) {
      var ship;
      if (json.ships[i].type == "Box Ship") {
        ship = new ShipBox(this.height,);
        this.ships.push(new ShipBox())
      }

      if (json.ships[i].type == "L Ship") {
        ship = new ShipBox(this.height,);
        this.ships.push(new ShipL())
      }

      if (json.ships[i].type == "Line Ship") {
        ship = new ShipBox(this.height,);
        this.ships.push(new ShipLine())
      }
    }
  }
}
