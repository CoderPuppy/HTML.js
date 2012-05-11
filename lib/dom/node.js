var Node = module.exports = (function NodeClass() {
	function Node(type) {
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
	
	Node.types = {
		text: 'text',
		element: 'element'
	};
	
	return Node;
})();
