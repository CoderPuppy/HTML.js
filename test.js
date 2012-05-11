var path = require('path');
var util = require('util');

var html = require(path.join(__dirname, 'lib/index'));

var doc = new html.Document();

var firstEl = doc.createElement('div');

firstEl.attributes.id = 'first';
firstEl.textContent = 'first';

doc.appendChild(firstEl);

var secondEl = doc.createElement('div');

secondEl.attributes.id = 'second';
secondEl.textContent = 'second';

doc.insertBefore(secondEl, firstEl);

var thirdEl = doc.createElement('div');

thirdEl.attributes.id = 'third';
thirdEl.textContent = 'third';

secondEl.appendChild(thirdEl);

var fourthEl = doc.createElement('div');

fourthEl.attributes.id = 'fourth';
fourthEl.innerHtml = '<h1 id="h1" class=hi>fourth</h1>';

firstEl.appendChild(fourthEl)

console.log('innerHtml: "%s"\nouterHtml: "%s"\ntextContent: "%s"', doc.innerHtml, doc.outerHtml, doc.textContent);

secondEl.outerHtml = '<span id="2" disabled>second</span>';

console.log('innerHtml: "%s"\nouterHtml: "%s"\ntextContent: "%s"', doc.innerHtml, doc.outerHtml, doc.textContent);

console.log('\n===================Script===================\n');

doc = new html.Document();

doc.innerHtml = "<script>console.log('<div />');</script>";

console.log('innerHtml: "%s"\nouterHtml: "%s"\ntextContent: "%s"', doc.innerHtml, doc.outerHtml, doc.textContent);
