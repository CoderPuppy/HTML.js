var path = require('path');

var parse = require(path.join(__dirname, '../html/parse'));
var gen = require(path.join(__dirname, '../html/gen'));
var inherits = require(path.join(__dirname, '../inherits'));
var merge = require(path.join(__dirname, '../merge'));
var clone = require(path.join(__dirname, '../clone'));
var html = require(path.join(__dirname, '../html/html'));
var Node = require(path.join(__dirname, 'node'));
var TextNode = require(path.join(__dirname, 'textNode'));
var tags = require(path.join(__dirname, 'tags'));

var tagSpecs = tags.tags;

function createElement(doc, data) {
	var el = doc.createElement(data.tagName);
	
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
		iEl = iEl instanceof Node ? iEl : createElement(el.getDoc(), iEl);
		iEl.parentNode = el;
		el.nodes.push(iEl);
		
		//el.emit('__:change:appendChild', iEl);
		//el.emit('__:change', 'appendChild', iEl);
		
		iEl.emit('__:change:appendedTo', el);
		iEl.emit('__:change', 'appendedTo', el);
	});
}

var Element = module.exports = (function ElementClass() {
	function Element(tag, str) {
		Node.call(this, Node.types.element);
		
		this.tag = tag.toUpperCase();
		this.attributes = {};
		
		this.tagSpec = tagSpecs[this.tag.toLowerCase()] || tagSpecs.default;
		
		//if(typeof(this.tagSpec.prototype) === 'object') merge(this, clone(this.tagSpec.prototype));
		
		Object.defineProperties(this, {
			tagName: {
				get: function() {
					return this.tag;
				},
				enumerable: true
			},
			outerHTML: {
				set: function(str) {
					this.nodes = [];
					
					insertElements(this, parse(str), html.outer);
					
					this.emit('__:change:outerHTML', str);
					this.emit('__:change:html', str, html.outer);
					this.emit('__:change', 'html', str, html.outer);
				},
				get: function() {
					return gen.html(this, {
						type: html.outer
					});
				},
				enumerable: true
			},
			innerHTML: {
				set: function(str) {
					this.nodes = [];
					
					if(typeof(str) === 'string') insertElements(this, parse(str), html.inner);
					
					this.emit('__:change:innerHTML', str);
					this.emit('__:change:html', str, html.inner);
					this.emit('__:change', 'html', str, html.inner);
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
					
					this.emit('__:change:textContent', str);
					this.emit('__:change', 'textContent', str);
				},
				get: function() {
					return gen.text(this, {
						type: html.inner
					});
				},
				enumerable: true
			},
			innerText: {
				get: function() { return this.textContent; },
				set: function(text) { this.textContent = text; },
				enumerable: true
			},
			outerText: {
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
		
		this.innerHTML = str;
		
//		debugger
		//if(typeof(this.tagSpec.create) === 'function') this.tagSpec.create.call(this);
	}
	inherits(Element, Node);
	
	merge(Element.prototype, {
		appendChild: function appendChild(node) {
			this.nodes.push(node);
			
			node.parentNode = this;
			
			this.emit('__:change:appendChild', node);
			this.emit('__:change', 'appendChild', node);
			
			node.emit('__:change:appendedTo', this);
			node.emit('__:change', 'appendedTo', this);
			
			return node;
		},
		insertBefore: function insertBefore(node, before) {
			if(before instanceof Node) {
				this.nodes.splice(this.nodes.indexOf(before), 0, node);
			} else {
				this.nodes.push(node);
			}
			
			this.emit('__:change:insertBefore', node, before);
			this.emit('__:change', 'insertBefore', node, before);
			
			node.emit('__:change:insertedBefore', this, before);
			node.emit('__:change', 'insertedBefore', this, before);
			
			node.parentNode = this;
			
			return node;
		},
		getElementsByTagName: function getElementsByTagName(tagName) {
			tagName = tagName.toUpperCase();
			return this.getNodes().filter(function(node) {
				return node.type === Node.types.element && node.tagName === tagName;
			});
		},
		getNodes: function getNodes() {
			if(this.childNodes.length) {
				var nodes = this.nodes;
	
				nodes.filter(function(node) {
					return node && node.childNodes.length;
				}).forEach(function(node) {
					nodes = nodes.concat(node.getNodes());
				});
	
				return nodes;
			} else {
				return [];
			}
		},
		getDoc: function getDoc() {
			if(this.tag && this.tag.toLowerCase() === 'document') {
				return this;
			} else {
				return this.parentNode.getDoc();
			}
		}
	});
	
	return Element;
})();
