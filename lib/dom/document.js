var path = require('path');

var inherits = require(path.join(__dirname, '../inherits'));
var merge = require(path.join(__dirname, '../merge'));
var Element = require(path.join(__dirname, 'element'));

var Document = module.exports = (function DocumentClass() {
	function Document(html) {
		Element.call(this, 'document');
		
		this.innerHTML = html;
	}
	inherits(Document, Element);
	
	merge(Document.prototype, {
		createElement: function createElement(tag) {
			return new Element(tag);
		}
	});
	
	return Document;
})();
