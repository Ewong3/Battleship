/*
  The game.js file handles functions which the players interact with the
  battleship game.
*/

/*
The shoot() function allows a player to 'shoot' at the board.
*/
function shoot(i,j) {
  console.log("clicked" + i + j);
  game.shoot(i, j);
  saveGame();
}

/*
  The restart() funtion will restart the game.
*/
function restart() {
  game = new Battleship(8, 8);
  game.updateDisplay();
  $("#resetButton").toggleClass("hidden");
  $("#startButton").toggleClass("hidden");
  saveGame();
}

/*
  The startGame() funtion will set up the game.
*/
function startGame() {

  game.updateDisplay();
  game.randomizeShips();
  $("#resetButton").toggleClass("hidden");
  $("#startButton").toggleClass("hidden");
  game.startGame();
  game.updateDisplay();
  saveGame();
}

/*
  The continueGame() funtion allows player's to continue their saved game.
  Depending on the game's state, it will hide/show the reset and start buttons.
*/
function continueGame() {
  game.updateDisplay();
  if (game.getState() == "playing") {
    $("#startButton").toggleClass("hidden");
  } else {
    $("#resetButton").toggleClass("hidden");
  }
  saveGame();
}

/*
  The loadGame() funtion will load a saved game. If there is no game saved,
  the loaded game will default to a game which has not started.
*/
function loadGame() {
  try {
    var retrievedObject = localStorage.getItem('battleshipGameInstance');

    console.log('retrievedObject: ', JSON.parse(retrievedObject));
    var json = JSON.parse(retrievedObject);

    game = new Battleship(8, 8);
    if (json != null) {
      game.loadJSON(json);
    }

  } catch (e) {
    console.log(e);
  }
}

/*
  The saveGame() funtion will save the state of the current game to localStorage.
*/
function saveGame() {
  localStorage.setItem('battleshipGameInstance', JSON.stringify(game));
}

/*
  Javascript code to initialize all game functionality.
*/
$("#resetButton").click(function() {
  restart();
});

$("#startButton").click(function() {
  startGame();
});

var game;
loadGame();
continueGame();
