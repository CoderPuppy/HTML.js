var path = require('path');

var inherits = require(path.join(__dirname, '../inherits'));
var Node = require(path.join(__dirname, 'node'));

var DocTypeNode = module.exports = (function DocTypeNodeClass() {
	function DocTypeNode(doctype) {
		Node.call(this, Node.types.doctype);
		
		this.value = doctype || 'html';
	}
	inherits(DocTypeNode, Node);
	
	return DocTypeNode;
})();
