var path = require('path');

var inherits = require(path.join(__dirname, '../inherits'));
var merge = require(path.join(__dirname, '../merge'));
var tags = require(path.join(__dirname, 'tags'));
var Node = require(path.join(__dirname, 'node'));
var Element = require(path.join(__dirname, 'element'));

var tagSpecs = tags.tags;

function htmlEl(doc) {
	return doc.getElementsByTagName('html')[0] || doc.appendChild(new Element('html'));
}

function headEl(html) {
	return html.getElementsByTagName('head')[0] || html.appendChild(new Element('head'));
}

function bodyEl(html) {
	return html.getElementsByTagName('body')[0] || html.appendChild(new Element('body'));
}

function arrange(doc) {
	var nodes = [],
		inBody = false,
		html = htmlEl(doc),
		head = headEl(html),
		body = bodyEl(html),
		where;
	
	doc.nodes.filter(function(node) {
		return node && node.type === Node.types.element && !( node === html || node === head || node === body );
	}).forEach(function(node) {
		inBody = ( tagSpecs[node.tagName.toLowerCase()] || tagSpecs.default ).inBody ? true : inBody;
		
		where = inBody ? body : head;
		
		where.appendChild(node);
	});
	
	debugger;
	
	doc.nodes = [html];
}

var Document = module.exports = (function DocumentClass() {
	function Document(html) {
		Element.call(this, 'document');
		
		this.on('__:change:html', function(html, type) {
			arrange(this);
		});
		
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
