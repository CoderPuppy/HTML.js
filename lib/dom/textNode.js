var path = require('path');

var inherits = require(path.join(__dirname, '../inherits'));
var Node = require(path.join(__dirname, 'node'));

var TextNode = module.exports = (function TextNodeClass() {
	function TextNode(text) {
		Node.call(this, Node.types.text);
		
		this.textContent = text || '';
	}
	inherits(TextNode, Node);
	
	return TextNode;
})();
