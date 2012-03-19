// dependencies
var fs = require('fs'),
    path = require('path');

// os separator
var SEP = process.platform === 'win32' ? '\\' : '/';

// configuration
var cwd,
    input = '';

var doPathCompletion = function() {
	var basepath = path.resolve(input);
	var dirname = input === '' ? basepath : path.dirname(basepath);
	var filename = input === '' ? '' : path.basename(basepath);

	try {
		var list = fs.readdirSync(dirname);
		var matchPart = null;
		var matches = [];

		list.forEach(function(file) { 
			if (file.indexOf(filename) === 0 || filename === '') {
				if (!matchPart) {
					matchPart = file;
				} else {
					for (var i = 0; i < matchPart.length && matchPart.charAt(i) === file.charAt(i); i++) {}
					matchPart = matchPart.substring(0,i);
				}

				// TODO: I'll use this later to do ab autocomplete list
				matches.push(file);
			}
		});

		var diff = matchPart.length - filename.length;
		var portion = diff === 0 ? '' : matchPart.substr(filename.length);
		var matchPath = path.join(dirname, matchPart);
		if (matches.length === 0) {
			return '';
		} else if (matches.length === 1) {
			try {
				return portion + (fs.statSync(matchPath).isDirectory() && matchPart === filename && input.charAt(input.length-1) !== SEP ? SEP : '');
			} catch (e) {
				return portion;
			}
		} else {
			// TODO: show list of matches if TAB clicked twice and diff === 0
			return portion;
		}
	} catch (e) {
		return '';
		// console.log(e);
	}
};

exports.getPathFromStdin = function(callback) {
	// accept raw input from command line
	var stdin = process.openStdin(); 
	require('tty').setRawMode(true);
	cwd = process.cwd();

	// handle all key presses
	stdin.on('keypress', function (chunk, key) {
		if (key) {
			if (key.ctrl && key.name === 'c') {
				process.exit();
			} else if (key.name === 'tab') {
				var output = doPathCompletion();
				input += output;
				process.stdout.write(output);
			} else if (key.name === 'enter') {
				//console.log('final: ' + path.resolve(input));
				process.stdout.write('\n');
				process.stdin.pause();
				callback(path.resolve(input));
			} else if (key.name === 'backspace') {
				if (input === '') return;
				input = input.substr(0, input.length-1);
				process.stdout.write('\b \b');
			} else if (chunk) {
				input += chunk;
				process.stdout.write(chunk);
			}
		} else if (chunk) {
			input += chunk;
			process.stdout.write(chunk);
		}
	});
};
