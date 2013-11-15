// # himins_game.js
// Manages a game object from a himins game JSON file.

/*jslint browser: false, continue: true, devel: true, indent: 2, maxerr: 50, newcap : true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: false, white: true
*/

// ## includes
var
  fs = require('fs'),
  commands = require('./himins_commands.js');

//# init(gameObject)
var init = function (gameObject) {
  console.log('*** himins_game.js init()');

  // init the commands object and add the predefined game commands to it
  commands.init(gameObject.commands);

  // add the name of the game as a command
  commands.addCommand({ name: gameObject.name.toLowerCase(),
      description: gameObject.description,
      action: '!NO_ACTION',
      kind: 'game' }
    );
};
module.exports.init = init;

//# loadGame(gameFileName)
var loadGame = function (gameFileName) {
  console.log('*** himins_game.js loadGame(%s)', gameFileName);
  var
    gameObject = {};

  fs.readFile(gameFileName, 'utf8', function (err, data) {
    if (err) {
      console.log(err);
    } else {
      gameObject = JSON.parse(data);
      //console.log(gameObject);
      init(gameObject);
    }
  });
  return gameObject;
};
module.exports.loadGame = loadGame;