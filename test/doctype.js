var path = require('path');

var html = require(path.join(__dirname, '../lib/index'));

console.log("\n================DocType <!DOCTYPE html><html />====================\n");

var doc = new html.Document();

doc.innerHTML = '<!DOCTYPE html><html />';

console.log(doc.innerHTML);

console.log("\n================DocType ''====================\n");

var doc = new html.Document();

doc.innerHTML = '';

console.log(doc.innerHTML);
