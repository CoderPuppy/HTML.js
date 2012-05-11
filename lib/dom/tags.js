var tags = exports.tags = {
	default: {
		noHTML: false
	},
	script: {
		noHTML: true
	}
};

var registerTag = exports.registerTag = function registerTag(name, tag) {
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
 *	noHTML: boolean,
 *	layout: function(LayoutObject),
 *	render: function(RenderObject)
 * }
 */

/*
 *	LayoutObject: renderer/layoutObject.js
 *	RenderObject: renderer/renderObject.js
 */
