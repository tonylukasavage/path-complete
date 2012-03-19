var pc = require('../lib/path-complete');
process.stdout.write('look for path: ');
pc.getPathFromStdin(function(path) {
	console.log('');
    console.log('path: ' + path);
});