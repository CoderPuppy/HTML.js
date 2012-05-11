var path = require('path');

var isArray = require(path.join(__dirname, '../isArray'));
var html = require(path.join(__dirname, 'html'));
var Node = require(path.join(__dirname, '../dom/node'));

function attributes(node) {
	if(typeof(node.attributes) === 'object') {
		var attrs = node.attributes;
		
		return Object.keys(attrs).map(function(name) {
			if(name === attrs[name]) {
				return name;
			} else {
				return name + '="' + attrs[name] + '"';
			}
		}).join(' ');
	}
	
	return '';
}

function open(node) {
	if(node.tagName) {
		var str = '<' + node.tagName.toLowerCase()
		if(typeof(node.attributes) === 'object' && Object.keys(node.attributes).length) {
			str += ' ' + attributes(node);
		}
	
		if(!node.nodes.length) {
			str += ' /';
		}
	
		return str += '>';
	}
	
	return '';
}

function close(node) {
	return node.tagName && node.nodes.length ? '</' + node.tagName.toLowerCase() + '>' : '';
}

var node = {
	attributes: attributes,
	open: open,
	close: close
};

function genHTML(node, options) {
	options = options || {};
	var type = options.type || html.outer;
	
	if(node.type === Node.types.comment) {
		return "<!--" + node.data + "-->";
	} if(node.type === Node.types.text) {
		return html.escape(node.textContent);
	} else if(isArray(node.childNodes)) {
		var str = ( type === html.outer ? open(node) : '' );
		
		node.nodes.forEach(function(node) {
			str += genHTML(node);
		});
		
		str += type === html.outer ? close(node) : '';
		
		return str;
	}
}

function genText(node) {
	var str = '';
	
	if(node.type === Node.types.text) {
		str = node.textContent;
	} else if(isArray(node.childNodes)) {
		node.childNodes.forEach(function(node) {
			str += genText(node);
		});
	}
	
	return str;
}

exports.node = node;
exports.html = genHTML;
exports.text = genText;
