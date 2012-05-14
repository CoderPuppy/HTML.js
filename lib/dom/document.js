var path = require('path');

var inherits = require(path.join(__dirname, '../inherits'));
var merge = require(path.join(__dirname, '../merge'));
var tags = require(path.join(__dirname, 'tags'));
var DocTypeNode = require(path.join(__dirname, 'doctypeNode'));
var Node = require(path.join(__dirname, 'node'));
var Element = require(path.join(__dirname, 'element'));

var tagSpecs = tags.tags;

function htmlEl(doc) {
	if(html = doc.getElementsByTagName('html')[0]) {
		return html;
	} else {
		html = new Element('html');
		
		html.nodes = doc.nodes;
		
		return html;
	}
}

function headEl(html) {
	return html.getElementsByTagName('head')[0] || html.appendChild(new Element('head'));
}

function bodyEl(html) {
	return html.getElementsByTagName('body')[0] || html.appendChild(new Element('body'));
}

function doctypeEl(doc) {
	return doc.getNodes().filter(function(node) {
		return node.type === Node.types.doctype;
	})[0] || new DocTypeNode();
}

function arrange(doc) {
	var nodes = [],
		inBody = false,
		html = htmlEl(doc),
		head = headEl(html),
		body = bodyEl(html),
		doctype = doctypeEl(doc),
		where;
	
	doc.nodes.filter(function(node) {
		return node && node.type === Node.types.element && !( node === html || node === head || node === body || node === doctype );
	}).forEach(function(node) {
		inBody = ( tagSpecs[node.tagName.toLowerCase()] || tagSpecs.default ).inBody ? true : inBody;
		
		where = inBody ? body : head;
		
		where.appendChild(node);
	});
	
	html.nodes = [head, body];
	doc.nodes = [doctype, html];
}

var Document = module.exports = (function DocumentClass() {
	function Document(html) {
		Element.call(this, 'document');
		
		this.on('__:change', function(html, type) {
			arrange(this);
			this.doctype = doctypeEl(this).value;
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
