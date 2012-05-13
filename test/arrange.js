var path = require('path');

var html = require(path.join(__dirname, '../lib/index'));

var doc = new html.Document();

doc.innerHTML = '<style></style><p></p>';

console.log(doc.innerHTML);
