// # himins_room.js
// Manages a room object from a himins room JSON file.

// ## includes
var fs = require('fs'),
		commands = require('./himins_commands.js');

// ## module vars
var roomObject = {};
// ## consts
var BOLD_RED_ESC = '\033[1;31m',
		BOLD_GREEN_ESC = '\033[1;32m',
		UL_BLUE_ESC = '\033[4;34m',
		NORMAL_ESC = '\033[0m',
		NL = '\n';

//# init()
var init = function () {
	//console.log('** himins_room.js init()'');

	// player
	playerLocation = roomObject.spawnSection;

	// commands
	loadItemCommands(playerLocation);
	loadNavigationCommands();
};
module.exports.init = init;

//# loadRoom(roomFileName)
var loadRoom = function (roomFileName, testMode) {
	console.log('** himins_room.js loadRoom(%s, %s)', roomFileName, testMode);

	fs.readFile(roomFileName, 'utf8', function (err, data) {
		if(err) {
			console.log(err);
		} else {
			roomObject = JSON.parse(data);
			//console.log(roomObject.name);
			init();
			if (testMode) {
				moduleTests();
			};
			//processUserInput();
		}
	});
};
module.exports.loadRoom = loadRoom;

// # loadItemCommands(sectionName)
var loadItemCommands = function (sectionName) {
	// console.log('*** himins_room.js loadSectionCommands(%s)', sectionName);

	var sectionObject = getSectionByName(sectionName);

	// remove old section commands
	commands.removeCommandsByKind('item');

	if (sectionObject.items) {
		// some items in section, load commands
		for (var i = sectionObject.items.length - 1; i >= 0; i--) {
			commands.addCommand({ name: sectionObject.items[i].name, 
														description: sectionObject.items[i].description,
														action: '!ADD_TO_INVENTORY',
														kind: 'item' });
		}
	}
};

// # loadNavigationCommands()
var loadNavigationCommands = function () {
	// remove all navigation commands
	commands.removeCommandsByKind('navigation');

	for (var i = roomObject.sections.length - 1; i >= 0; i--) {
		commands.addCommand({ name: roomObject.sections[i].name, 
													description: roomObject.sections[i].description,
													action: '!SET_LOCATION',
													kind: 'navigation' });
	}
};

// # getSectionByName(name)
var getSectionByName = function (name) {
	//console.log("*** himins_room.js getSectionByName(%s)", name);
	var result = {};

	for (var i = roomObject.sections.length - 1; i >= 0; i--) {
		if (roomObject.sections[i].name === name) {
			result = roomObject.sections[i];
			break;
		}
	}
	return result;
};

// # getItemByName(sectionName, itemName)
var getItemByName = function (sectionName, itemName) {
	var result = {},
			sectionObject = getSectionByName(sectionName);

	if (sectionObject) {
		for (var i = sectionObject.items.length - 1; i >= 0; i--) {
			if (sectionObject.items[i].name === itemName) {
				result = sectionObject.items[i];
			}
		}
	}
};

// # welcome()
var welcome = function () {
	console.log();
	console.log(formatText('Welcome to the ' + roomObject.name));
	console.log(formatText('-'.repeat( 'Welcome to the '.length + roomObject.name.unformattedLength())));
	console.log(formatText(roomObject.description, 80));
	console.log();

	if (playerLocation) {
		var message = navigationCommandsObject[playerLocation];
		doNavigationCommand(playerLocation, message);
	};
};

//# processUserInput()
var processUserInput = function () {
	//console.log("** himins_room.js processUserInput()");

	var readline = require('readline'),
			rl = readline.createInterface(process.stdin, process.stdout);

	welcome();

	rl.setPrompt('himins> ');
	rl.prompt();

	rl.on('line', function(line) {
		var cmd = line.trim().toLowerCase(),
				message = '';

		message = gameCommandsObject[cmd];
		if (message) {
			doGameCommand(rl, cmd, message);
		}

		message = navigationCommandsObject[cmd];
		if (message) {
			doNavigationCommand(cmd, message);
		}

		message = sectionCommandsObject[cmd];
		if(message) {
			doItemCommand(cmd, message);
		}

		rl.prompt(true);

	});

	rl.on('close', function () {
		process.exit(0);
	});
};
module.exports.processUserInput = processUserInput;

// # tests()
var moduleTests = function () {
	console.log('*** himins_room.js test mode start ***')
	console.log('*** himins_room.js test mode end ***')

};


// # main entry point
// For testing purposes you can run this file directly with "node himins_room.js". The test logic expects a file named "himins_room_1.json" with the defination of a room object!

loadRoom("himins_room_1.json");
