var path = require('path');

var html = require(path.join(__dirname, '../lib/index'));

var str = '';

process.stdin.on('data', function(d) {
	str += d;
}).on('end', function() {
	var doc = new html.Document(str);
	
	process.stdout.write(doc.innerHTML);
}).resume();
