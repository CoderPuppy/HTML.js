var tags = exports.tags = {
	default: {
		html: true,
		comments: true,
		inBody: true
	},
	script: {
		html: false,
		comments: false
	},
	style: {
		html: false,
		comments: false
	}
};

var add = exports.add = function add(name, tag) {
	if(typeof(name) === 'string' && typeof(tag) !== 'undefined') {
		return tags[name] = tag;
	} else {
		console.warn('Register tag mayhem:', name, tag);
	}
};

/*
 * =====Tag Spec=====
 *
 * TAG {
 *	html: boolean,
 *	comments: boolean,
 *	inBody: boolean
 *	create: function(),
 *	prototype: Object <optional>
 * }
 */

/*
 *	LayoutObject: renderer/layoutObject.js
 *	RenderObject: renderer/renderObject.js
 */
