var path = require('path');
var fs = require('fs');

var html = require(path.join(__dirname, '../'));

var ignoreFiles = [
	'reparse.js'
];

var run = process.argv.slice(2);

run = run.length ? run : undefined;

fs.readdir(__dirname, function(err, files) {
	files.filter(function(file) {
		return file && /\.js$/.test(file) && file !== 'test.js' && ignoreFiles.indexOf(file) === -1;
	}).filter(function(file) {
		return typeof(run) === 'object' ? run.indexOf(file.replace(/\.js$/, '')) >= 0 : true;
	}).forEach(function(name) {
		var test, tests, testName;
		console.log('\n==================Running %s=====================', name.replace(/\.js$/, ''));
		
		test = require(path.join(__dirname, name.replace(/\.js$/, '')));
		tests = test.tests;
		testName = test.name;
		
		if(tests) {
			tests.filter(Boolean).forEach(function(test) {
				var doc;
				
				console.log('\n===================' + testName + ( typeof(test.html) === 'string' ? ' "' + test.html + '"' : '' ) + '=======================\n');
				doc = new html.Document(test.html, test.plugins);
				
				if(typeof(test.run) === 'function') {
					test.run(doc);
				}
				
				console.log(doc.innerHTML);
			});
		}
		
		console.log('\n==================Done Running %s=====================', testName);
	});
	
	console.log('\n==================Done=====================');
});
