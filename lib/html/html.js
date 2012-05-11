var path = require('path');

var parse = require(path.join(__dirname, 'parse'));

RegExp.escape = function(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

var badChars     = ['&'  , '<' , '>' ];
var replacements = ['amp', 'lt', 'gt'];

function htmlEscape(text) {
	var orig = text;
	
	badChars.forEach(function(badChar, i) {
		text = text.replace(new RegExp(RegExp.escape(badChar), 'g'), '&' + replacements[i] + ';');
	});
	
	text.original = orig;
	
	return text;
}

function htmlUnEscape() {
	
}

exports.escape = htmlEscape;
exports.unescap = htmlUnEscape;
exports.parse = parse;
exports.outer = 'outer';
exports.inner = 'inner';
