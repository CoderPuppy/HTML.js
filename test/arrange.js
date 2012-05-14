var path = require('path');

var html = require(path.join(__dirname, '../lib/index'));

console.log("\n================Arrange <style></style><p></p>====================\n");

var doc = new html.Document();

doc.innerHTML = '<style></style><p></p>';

console.log(doc.innerHTML);

console.log("\n================Arrange <body>body</body><head>head</head>====================\n");

doc.innerHTML = '<body>body</body><head>head</head>';

console.log(doc.innerHTML);
