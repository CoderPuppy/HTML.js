var path = require('path');
var fs = require('fs');

var ignoreFiles = [
	'reparse.js'
];

fs.readdir(__dirname, function(err, files) {
	files.filter(function(file) {
		return file && /\.js$/.test(file) && file !== 'test.js' && ignoreFiles.indexOf(file) === -1;
	}).forEach(function(name) {
		console.log('\n==================Running %s=====================\n', name.replace(/\.js$/, ''));
		
		require(path.join(__dirname, name.replace(/\.js$/, '')));
		
		console.log('\n==================Done Running %s=====================', name.replace(/\.js$/, ''));
	});
	
	console.log('\n==================Done=====================');
});
