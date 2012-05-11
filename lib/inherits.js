var inherits = module.exports = function inherits(subClass, from) {
	subClass._super = from;
	subClass.prototype = Object.create(from.prototype, {
		constructor: {
			value: subClass
		}
	});
};
