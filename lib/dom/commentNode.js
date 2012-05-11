var path = require('path');

var merge = require(path.join(__dirname, '../merge'));
var inherits = require(path.join(__dirname, '../inherits'));
var Node = require(path.join(__dirname, 'node'));

var CommentNode = module.exports = (function CommentNodeClass() {
	function CommentNode(text) {
		Node.call(this, Node.types.comment);
		
		this.data = text;
		
		Object.defineProperties(this, {
			length: {
				get: function() { return this.data.length; },
				enumerable: true
			}
		});
	}
	inherits(CommentNode, Node);
	
	merge(CommentNode.prototype, {
		
	});
	
	return CommentNode;
})();
