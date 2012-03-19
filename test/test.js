var pc = require('path-complete');
pc.getPathFromStdin(function(path) {
    console.log('');
    console.log('path: ' + path);
});