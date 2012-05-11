var path = require('path');

var Element = require(path.join(__dirname, '../dom/element'));
var TextNode = require(path.join(__dirname, '../dom/textNode'));
var CommentNode = require(path.join(__dirname, '../dom/commentNode'));
var tags = require(path.join(__dirname, '../dom/tags'));

var tagSpecs = tags.tags;

function execReFrom(str, re, index) {
	var matches = [],
		curMatch;
	
	if(!re.global) throw new Error('Not global');
	
	re.lastIndex = index;
	
	while(curMatch = re.exec(str)) matches.push(curMatch);
	
	return matches;
}

function parse(html) {
	var data = [],
		curEl = { children: data },
		curTag = { noHTML: false, allowComments: true },
		inTag = false,
		lastEl = 0,
		tags = [],
		i, cur, tag, startTag;
	
	for(i = 0; i < html.length; i++) {
		cur = html[i];
		
		if(inTag){
			if(cur === '>') {
				inTag = false;
				
				if(tag[0] === '!') {
					if(curTag.allowComments) {
						curEl.children.push(new CommentNode(tag.replace(/^\!\-*/, '').replace(/\-*$/, '').trim()));
					} else {
						if(curEl.children[curEl.children.length - 1] instanceof TextNode) {
							curEl.children[curEl.children.length - 1].textContent += tag.replace(/^\!\-*/, '').replace(/\-*$/, '').trim();
						} else {
							curEl.children.push(new TextNode(tag.replace(/^\!\-*/, '').replace(/\-*$/, '').trim()));
						}
					}
				} else {
					tagName = tag.replace(/\/$/, '').substring(0, / |\/?$/.exec(tag).index).trim();
				
					if(tagName[0] === '/') {
						if(curTag.noHTML) {
							tags.splice(-1, 1);
						} else if(tags.lastIndexOf(tagName.replace(/^\/\s*|\s*\/$/g, '')) >= 0) {
							tags.splice(tags.lastIndexOf(tagName.replace(/^\//, '')));
						}
					} else if(!curTag.noHTML) {
						// Create the new element
						curEl = createElement(curEl, tag);
						tags.push(tagName);
						curTag = tagSpecs[tagName] || tagSpecs.default;
					} else {
						if(curEl.children[curEl.children.length - 1] instanceof TextNode) {
							curEl.children[curEl.children.length - 1].textContent += "<" + tag + ">";
						} else {
							curEl.children.push(new TextNode("<" + tag + ">"));
						}
					}
				}
				
				lastEl = i + 1;
			//} else if(cur === '/' && html[i + 1] === '>') {
			} else {
				tag += cur;
			}
		} else if(!inTag) {
			if(cur === '<') {
				/*tagNameStart = execReFrom(html, /\w/g, i);
				tagName = html.substring(tagNameStart).split(' ')[0];
				console.log(tagNameStart, tagName);*/
				inTag = true;
				tag = '';
				startTag = i;
				if(i > lastEl) {
					curEl.children.push(new TextNode(html.substring(lastEl, i)));
				}
			} else if(/[\w\&\#\d]/.test(cur)) {
				//curEl.textContent += cur;
			}
		}
	}
	
	if(i - 1 > lastEl) {
		curEl.children.push(new TextNode(html.substring(lastEl, i - 1)));
	}
	
	return data;
}

function parseTag(tag) {
	var parts = [],
		lastPart = 0,
		i, cur, inStr;
	
	for(i = 0; i < tag.length; i++) {
		cur = tag[i];
		
		if(inStr) {
			if(cur === inStr) {
				inStr = undefined;
			}
		} else {
			if(cur === ' ') {
				parts.push(tag.substring(lastPart, i));
				lastPart = i;
			} else if(cur === '"' || cur === "'") {
				inStr = cur;
			}
		}
	}
	
	parts.push(tag.substr(lastPart, i));
	
	parts = parts.map(function(part) {
		return part.trim();
	}).filter(function(part) {
		return part && part.length;
	});
	
	return parts;
}

function removeQuotes(str) {
	var quote = /^["']/.exec(str);
	
	if(quote) {
		quote = quote[0];
	
		return str.replace(new RegExp('^' + quote), '').replace(new RegExp(quote + '$'), '');
	}
	
	return str;
}

function parseAttributes(parts) {
	var attrs = {};
	
	parts.map(function(part) {
		if(part.indexOf('=') >= 0) {
			return [ part.substring(0, part.indexOf('=')), part.substring(part.indexOf('=') + 1) ];
		} else {
			return [ part ];
		}
	}).forEach(function(attr) {
		attrs[attr[0]] = attr.length > 1 ? removeQuotes(attr[1]) : attr[0];
	});
	
	return attrs;
}

function createElement(parent, tag) {
	var tag = parseTag(tag),
		tagName = tag[0],
		attributes = parseAttributes(tag.slice(1)),
		el = {
			tagName: tagName,
			attributes: attributes,
			children: []
		};
	
	parent.children.push(el);
	
	return el;
}

module.exports = parse;
