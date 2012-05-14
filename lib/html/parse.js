var path = require('path');

var TextNode = require(path.join(__dirname, '../dom/textNode'));
var CommentNode = require(path.join(__dirname, '../dom/commentNode'));
var DocTypeNode = require(path.join(__dirname, '../dom/doctypeNode'));
var tags = require(path.join(__dirname, '../dom/tags'));
var html = require(path.join(__dirname, 'html'));

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
		curTag = { html: true, comments: true },
		inTag = false,
		lastEl = 0,
		tags = [],
		i, cur, tag, startTag;
	
	for(i = 0; i < html.length; i++) {
		cur = html[i];
		
		if(inTag){
			if(cur === '>') {
				inTag = false;
				
				if(tag[0] === '!') { // comment or doctype
					if(tag.trim().replace(/^\!/, '').trim().split(' ')[0].toLowerCase() === 'doctype') { // doctype
						curEl.children.push(new DocTypeNode(tag.trim().replace(/^\!/, '').trim().split(' ')[1]));
					} else {
						if(curTag.comments) {
							curEl.children.push(new CommentNode(tag.replace(/^\!\-*/, '').replace(/\-*$/, '').trim()));
						} else {
							if(curEl.children[curEl.children.length - 1] instanceof TextNode) {
								curEl.children[curEl.children.length - 1].textContent += tag.replace(/^\!\-*/, '').replace(/\-*$/, '').trim();
							} else {
								curEl.children.push(new TextNode(tag.replace(/^\!\-*/, '').replace(/\-*$/, '').trim()));
							}
						}
					}
				} else { // regular tag
					tagName = tag.replace(/\/$/, '').substring(0, / |\/?$/.exec(tag).index).trim(); // tag name: <html> => html
				
					if(tagName[0] === '/') { // end tag
						var index = 0; // how many to slice off
						if(!curTag.html) { // no html: slice of one
							index = -1;
						} else if(tags.lastIndexOf(tagName.replace(/^\/\s*|\s*\/$/g, '')) >= 0) { // is there one to slice off
							index = tags.lastIndexOf(tagName.replace(/^\//, ''));
						}
						
						if(index > -1) {
							var numberToRemove = tags.length - index;
						
							for(; numberToRemove; numberToRemove--) {
								curEl = curEl.parentNode;
							}
						} else if(index === -1) {
							curEl = curEl.parentNode;
						}
						
						curTag = tagSpecs[curEl.tagName] || tagSpecs.default;
						
						tags.splice(index);
					} else if(curTag.html) {
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
			} else {
				tag += cur;
			}
		} else if(!inTag) {
			if(cur === '<') {
				var ok = true;
				if(!curTag.html) {
					var tagSlashIndex = /\//g;
					tagSlashIndex.lastIndex = lastIndex = i - 1;
					tagSlashIndex = tagSlashIndex.exec(html);
					if(tagSlashIndex) tagSlashIndex = tagSlashIndex.index;
					
					if(!/^\s*$/.test(html.substring(i + 1, tagSlashIndex))) ok = false;
					
					var tagNameIndex = new RegExp(RegExp.escape(curEl.tagName), 'g');
					tagNameIndex.lastIndex = tagSlashIndex - 1;
					tagNameIndex = tagNameIndex.exec(html);
					if(tagNameIndex) tagNameIndex = tagNameIndex.index;
					
					if(!/^\s*$/.test(html.substring(tagSlashIndex + 1, tagNameIndex))) ok = false;
				}
				if(ok) {
					inTag = true;
					tag = '';
					startTag = i;
					if(i > lastEl) {
						curEl.children.push(new TextNode(html.substring(lastEl, i)));
					}
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
			children: [],
			parentNode: parent
		};
	
	parent.children.push(el);
	
	return el;
}

module.exports = parse;
