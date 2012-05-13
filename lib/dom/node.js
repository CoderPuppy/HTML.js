var events = require('events');
var path   = require('path');

var inherits = require(path.join(__dirname, '../inherits'));

var Node = module.exports = (function NodeClass() {
	function Node(type) {
		events.EventEmitter.call(this);
		
		this.type = type;
		
		this.nodes = [];
		
		Object.defineProperties(this, {
			childNodes: {
				get: function() {
					return this.nodes;
				},
				enumerable: true
			}
		});
	}
	inherits(Node, events.EventEmitter);
	
	Node.types = {
		text: 'text',
		element: 'element',
		comment: 'comment'
	};
	
	return Node;
})();
