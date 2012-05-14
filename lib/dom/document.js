var path = require('path');

var inherits = require(path.join(__dirname, '../inherits'));
var merge = require(path.join(__dirname, '../merge'));
var clone = require(path.join(__dirname, '../clone'));
var tags = require(path.join(__dirname, 'tags'));
var DocTypeNode = require(path.join(__dirname, 'doctypeNode'));
var Node = require(path.join(__dirname, 'node'));
var Element = require(path.join(__dirname, 'element'));
var Plugins = require(path.join(__dirname, '../plugins')).Plugins;

var tagSpecs = tags.tags;
var defaultTags = tagSpecs;

// START Plugins
require(path.join(__dirname, '../plugins/tags')); // tags
// END   Plugins

function htmlEl(doc) {
	if(html = doc.getElementsByTagName('html')[0]) {
		return html;
	} else {
		html = doc.createElement('html');
		
		html.nodes = doc.nodes;
		
		return html;
	}
}

function headEl(doc, html) {
	return html.getElementsByTagName('head')[0] || html.appendChild(doc.createElement('head'));
}

function bodyEl(doc, html) {
	return html.getElementsByTagName('body')[0] || html.appendChild(doc.createElement('body'));
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
		head = headEl(doc, html),
		body = bodyEl(doc, html),
		doctype = doctypeEl(doc),
		where;
	doc.nodes = [doctype, html];
	
	doctype.parentNode = doc;
	html.parentNode = doc;
	
	html.nodes.filter(function(node) {
		return node && node.type === Node.types.element && !( node === html || node === head || node === body || node === doctype );
	}).forEach(function(node) {
		inBody = ( tagSpecs[node.tagName.toLowerCase()] || tagSpecs.default ).inBody ? true : inBody;
		
		where = inBody ? body : head;
		
		where.appendChild(node);
	});
	
	html.nodes = [head, body];
	
	doc.getNodes().forEach(function(node) {
		node.emit('__:arranged');
	});
}

var Document = module.exports = (function DocumentClass() {
	function Document(html, plugins) {
		this.window = {
			document: this,
			console: {
				log: function() { return console.log.apply(console, ['LOG:'].concat([].slice.call(arguments, 0))); }
			}
		};
		
		this.tags = clone(defaultTags);
		this._plugins = new Plugins(this, ['tags'].concat(plugins || []));
		
		Element.call(this, 'document', html);
		
		this.on('__:change', function(html, type) {
			arrange(this);
			this.doctype = doctypeEl(this).value;
		}).emit('__:change');
	}
	inherits(Document, Element);
	
	merge(Document.prototype, {
		createElement: function createElement(tag, html) {
			var el = new Element(tag, html),
				tagSpec = this.tags[el.tagName.toLowerCase()] || this.tags.default;
			
			if(typeof(tagSpec.prototype) === 'object') merge(el, clone(tagSpec.prototype));
			if(typeof(tagSpec.create) === 'function') tagSpec.create.call(el);
			
			return el;
		}
	});
	
	return Document;
})();
