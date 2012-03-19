# path-complete for Node.js by [@tonylukasavage](https://twitter.com/#!/tonylukasavage)

path-complete is a [Node.js](http://nodejs.org/) package for command line TAB path completion. 

## Video Demonstration

[https://vimeo.com/38800422](https://vimeo.com/38800422)

## Installation

`npm install path-complete`

## Basic Usage

```javascript
var pc = require('path-complete');
pc.getPathFromStdin(function(path) {
	console.log('');
	console.log('path: ' + path);
});
```