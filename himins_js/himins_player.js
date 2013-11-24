// # himins_player.js
// Manages a player object from a himins player JSON file.

/*jslint browser: false, continue: true, devel: true, indent: 2, maxerr: 50, newcap : true, nomen: true, plusplus: true, regexp: true, sloppy: true, vars: false, white: true
*/

// ## includes
var
  // ### 3rd party modules
  _ = require('underscore'),

  // ### Himins modules
  commands = require('./himins_commands'),
  game = require('./himins_game'),
  room = require('./himins_room'),
  player = require('./himins_player'),
  repl = require('./himins_repl'),
  format = require('./himins_format');

// ## module vars

//# init(playerObject)
var init = function (playerObject) {
  console.log('*** himins_player.js init(', playerObject.name, ')');

  // if the player has any starter items in her inventory add their names as commands
   _.each(playerObject.inventory, function (e, i, l) {
    commands.addCommand(playerObject.commands, { 
      name: e.name,
      description: e.description,
      action: e.action,
      kind: e.kind 
    });
  });
};
module.exports.init = init;

//# getInventoryNames(playerObject)
// Returns a string with the names of the items in the player inventory
var getInventoryNames = function (playerObject) {
  var
    resultString = '',
    resultList = [];

  _.each(playerObject.inventory, function (e, i, l) {
    resultList.push('_' + e.name + '_');
  });

  resultString = resultList.toString().replace(/,/g, ', ');
  return resultString;
};
module.exports.getInventoryNames = getInventoryNames;

// # enterRoom(playerObject, roomObject)
// Call when a player first spawns or enters a room
var enterRoom = function (playerObject, roomObject) {
  // add commands for this room
  playerObject.commands = commands.combineCommands(playerObject.commands, roomObject.commands);

  repl.writeToClient(playerObject.client, format.formatText(playerObject.client, roomObject.description, 2, 78));
};
module.exports.enterRoom = enterRoom;

// # exitRoom(playerObject, roomObject)
// Call when a player finally despawns or leaves a room
var exitRoom = function (playerObject, roomObject) {
  // remove commands for this room
  playerObject.commands = commands.removeCommandsByKind(playerObject.commands, 'room');
};
module.exports.exitRoom = exitRoom;


// # enterSection(playerObject, sectionObject)
// Call when a player first spawns or enters a section
var enterSection = function (playerObject, sectionObject) {
  // add commands for this section
  playerObject.commands = commands.combineCommands(playerObject.commands, sectionObject.commands);
};
module.exports.enterSection = enterSection;

// # exitSection(playerObject, sectionObject)
// Call when a player finally despawns or leaves a room
var exitSection = function (playerObject, sectionObject) {
  // remove commands for this section
  playerObject.commands = commands.removeCommandsByKind(playerObject.commands, 'section');
};
module.exports.exitSection = exitSection;

// # moveToSection(playerObject, action)
var moveToSection = function (playerObject, action) {
  var gameObject = playerObject.game,
      roomObject = game.getRoomByName(gameObject, playerObject.roomName),
      sectionObject = room.getSectionByName(roomObject, playerObject.sectionName),
      targetSectionName = action.substring(4).toLowerCase(), // remove '!GO_'
      targetSectionObject = room.getSectionByName(roomObject, targetSectionName);

  exitSection(playerObject, sectionObject);
  playerObject.sectionName = targetSectionName;
  enterSection(playerObject, targetSectionObject);

};
module.exports.moveToSection = moveToSection;

// # moveToRoom(playerObject, commandObject)
var moveToRoom = function (playerObject, commandObject) {
    var gameObject = playerObject.game,
      roomObject = game.getRoomByName(gameObject, playerObject.roomName),
      sectionObject = room.getSectionByName(roomObject, playerObject.sectionName),
      targetRoomName = commandObject.parameters.nextRoomName,
      targetRoomObject = game.getRoomByName(gameObject, targetRoomName),
      targetSectionName = roomObject.spawnSection,
      targetSectionObject = room.getSectionByName(roomObject, targetSectionName);

  exitRoom(playerObject, roomObject);
  exitSection(playerObject, sectionObject);
  playerObject.roomName = targetRoomName;
  playerObject.sectionName = targetSectionName;
  enterRoom(playerObject, targetRoomObject);
  enterSection(playerObject, targetSectionObject);

};
module.exports.moveToRoom = moveToRoom;








