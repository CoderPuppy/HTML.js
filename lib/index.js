var path = require('path');

var Document = exports.Document = require(path.join(__dirname, 'dom/document'));
var plugins = exports.plugins = require(path.join(__dirname, 'plugins'));

// Add default plugins

require(path.join(__dirname, 'plugins/script')); // scripts
