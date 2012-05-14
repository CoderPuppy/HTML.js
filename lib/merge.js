var merge = module.exports = function merge(dest, src, deep) {
	if(deep) return deepMerge(dest, src);
	
	Object.getOwnPropertyNames(src).forEach(function(name) {
		Object.defineProperty(dest, name, Object.getOwnPropertyDescriptor(src, name));
	});
	
	return dest;
};

var deepMerge = module.exports.deepMerge = function deepMerge(dest, src) {
	Object.getOwnPropertyNames(src).map(function(name) {
		return { name: name, desc: Object.getOwnPropertyDescriptor(src, name) };
	}).map(function(desc) {
		if(typeof(desc.desc.get) === 'function') {
			return desc;
		} else {
			return {
				name: desc.name,
				desc: {
					writable: desc.desc.writable,
					enumerable: desc.desc.enumerable,
					configurable: desc.desc.configurable,
					value: deepMerge(desc.desc.value)
				}
			};
		}
	}).forEach(function(desc) {
		Object.defineProperty(dest, desc.name, desc.desc);
	});
	
	return dest;
};
