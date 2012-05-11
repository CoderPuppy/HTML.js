var path = require('path');

var parse = require(path.join(__dirname, '../html/parse'));
var gen = require(path.join(__dirname, '../html/gen'));
var inherits = require(path.join(__dirname, '../inherits'));
var merge = require(path.join(__dirname, '../merge'));
var html = require(path.join(__dirname, '../html/html'));
var Node = require(path.join(__dirname, 'node'));
var TextNode = require(path.join(__dirname, 'textNode'));

function createElement(data) {
	var el = new Element(data.tagName);
	
	merge(el.attributes, data.attributes);
	insertElements(el, data.children, html.inner);
	
	return el;
}

function insertElements(el, elements, type) {
	if(type === html.outer && typeof(elements[0]) !== 'undefined') {
		if(typeof(elements[0].tagName) === 'string') {
			el.tag = elements[0].tagName.toUpperCase();
			if(typeof(elements[0].attributes) === 'object') el.attributes = elements[0].attributes;
			if(typeof(elements[0].children) === 'object') elements = elements[0].children;
		} else if(elements[0] instanceof Node) {
			// replace with the node
		}
	}
	
	elements.forEach(function(iEl) {
		el.appendChild(iEl instanceof Node ? iEl : createElement(iEl));
	});
}

var Element = module.exports = (function ElementClass() {
	function Element(tag) {
		Node.call(this, Node.types.element);
		
		this.tag = tag.toUpperCase();
		this.attributes = {};
		
		Object.defineProperties(this, {
			tagName: {
				get: function() {
					return this.tag;
				},
				enumerable: true
			},
			outerHtml: {
				set: function(str) {
					this.nodes = [];
					
					insertElements(this, parse(str), html.outer);
				},
				get: function() {
					return gen.html(this, {
						type: html.outer
					});
				},
				enumerable: true
			},
			innerHtml: {
				set: function(str) {
					this.nodes = [];
					
					insertElements(this, parse(str), html.inner);
				},
				get: function() {
					return gen.html(this, {
						type: html.inner
					});
				},
				enumerable: true
			},
			textContent: {
				set: function(text) {
					this.nodes = [new TextNode(text)];
				},
				get: function() {
					return gen.text(this, {
						type: html.inner
					});
				},
				enumerable: true
			},
			children: {
				get: function() {
					return this.nodes.filter(function(node) {
						return node.type === Node.types.element;
					});
				},
				enumerable: true
			}
		});
	}
	inherits(Element, Node);
	
	merge(Element.prototype, {
		appendChild: function appendChild(node) {
			return this.nodes[this.nodes.push(node) - 1];
		},
		insertBefore: function insertBefore(node, before) {
			if(before instanceof Node) {
				this.nodes.splice(this.nodes.indexOf(before), 0, node);
			} else {
				this.nodes.push(node);
			}
			
			return node;
		}
	});
	
	return Element;
})();
