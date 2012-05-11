var isArray = module.exports = function isArray(a) {
	return !!(a && typeof(a.length) == 'number')
};
