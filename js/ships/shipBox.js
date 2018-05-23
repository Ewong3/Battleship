/*
  The ShipBox class is a class which represents a box-shaped ship.
*/

class ShipBox {
  constructor() {
    this.area = [];
    this.type = "Box Ship";
  }

  /*
    The randomizeShip() function will randomize the location and determine the
    area of the ship given the height and width of the board.The area will be
    set as a 2x2 box.
  */
  randomizeShip(height, width) {
    var yStart = Math.floor((Math.random() * height));
    var xStart = Math.floor((Math.random() * width));

    var block1 = {x:xStart, y:yStart};
    var block2 = {x:xStart + 1, y:yStart};
    var block3 = {x:xStart, y:yStart + 1};
    var block4 = {x:xStart + 1, y:yStart + 1};

    this.area.push(block1);
    this.area.push(block2);
    this.area.push(block3);
    this.area.push(block4);
  }

  /*
    The loadJSON() function will set data given a json object.
  */
  loadJSON(json) {
    this.area = json.area;
    this.type = json.type;
  }

  /*
    The getArea() function will return the array of area the ship occupies.
  */
  getArea() {
    return this.area;
  }

  /*
    The occupies() function will return true if the area of the ship overlaps
    the given coordinate. Otherwise, it will return false.
  */
  occupies(y, x) {
    for (var i = 0; i < this.getArea().length; i++) {
      var area = this.getArea()[i];
      if (area.x == x && area.y == y) {
        return true;
      }
    }
    return false;
  }

  /*
    The getType() function will return the type of the ship.
  */
  getType() {
    return this.type;
  }
}
