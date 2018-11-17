const Discord = require('discord.js');
const client = new Discord.Client();
const config = require('./config.json');
const credentials = require('./credentials.json');
const fs = require('fs');


client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);

	client.user.setActivity(config.prefix + 'help');
});

client.on('message', msg => {
	if(msg.author == client.user) {
		return;
	}

	if(msg.content.startsWith(config.prefix)) {
		processCommand(msg);
	}
});

function writeToConfig(value, replaceValue) {
	fs.readFile('config.json', 'utf8', function readFileCallback(err, data) {
		if (err) {
			console.log(err);
		}
		else {
	    obj = JSON.parse(data); // now it an object
	    obj[value] = replaceValue; // add some data
	    json = JSON.stringify(obj); // convert it back to json
			fs.writeFile('config.json', json, (err) => {
  			if (err) throw err;
  			console.log('Written to config!');
			}); // write it back
		}
	});
}

function loadFromConfig(){
	config = require('./config.json');
}

function processCommand(msg) {
	const fullCommand = msg.content.substr(config.prefix.length); // Removes prefix
	const splitCommand = fullCommand.split(' ');
	const primaryCommand = splitCommand[0].toLowerCase();
	const arguments = splitCommand.slice(1, splitCommand.length);
	msg.reply(arguments);

	switch(primaryCommand) {
	case 'help':
		msg.reply('You called for help?');
		break;
	case 'prefix':
		if(arguments.length == 1) {
			writeToConfig('prefix', arguments[0])
			config.prefix = arguments[0];
			client.user.setActivity(arguments[0] + 'help');
			msg.reply('You\'ve changed the prefix to ' + arguments[0]);
		}
		else {
			msg.reply('Invalid amount of arguments!');
		}
		break;
	default:
		msg.reply('Invalid command, refer to ' + config.prefix + 'help for help');
		break;
	}
}

client.login(credentials.token);
