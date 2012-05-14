var path = require('path');

var tags = require(path.join(__dirname, 'dom/tags'));

const plugins = {};

function install(plugin) {
	var what = { tags: {} },
		api = {
			tags: {
				add: function add(name, tag) {
					what.tags[name] = tag;
				}
			}
		};
	
	plugin.install(api);
	
	return what;
}

var add = exports.add = function add(name, plugin) {
	if(typeof(plugins[name]) === 'undefined') {
		plugins[name] = { install: plugin, installed: false, what: undefined };
	}
	
	return exports;
};

/*var activate = exports.activate = function activate(name) {
	var plugin = plugins[name],
		what = plugin.what;
	
	if(!plugin) throw new Error('No such plugin: ' + name);
	
	if(!plugin.installed) what = plugin.what = install(plugin);
	
	Object.keys(what.tags) // should have it's own plugin system
		.forEach(function(name) {
			tags.add(name, what.tags[name]);
		});
	
	return exports;
};

var deactivate = exports.deactivate = function deactivate(name) {
	var plugin = plugins[name],
		what = plugin.what;
	
	if(!plugin) throw new Error('No such plugin: ' + name);
	
	if(!plugin.installed) install(plugin);
	
	Object.keys(what.tags) // should have it's own plugin system
		.forEach(function(name) {
			tags.remove(name);
		});
	
	return exports;
};*/

//require(path.join(__dirname, 'plugins/script'));

// New System

var Plugins = exports.Plugins = (function PluginsClass() { // Should be in module.exports
	function Plugins(doc, plugins) {
		var self = this;
		
		this.doc = doc;
		this.enabled = plugins || [];
		this.activators = {};
		
		this.enabled.forEach(function(plugin) {
			self.activate(plugin);
		});
	}
	
	function createWhat(activators) {
		var what = { activators: [] };
		
		Object.keys(activators).forEach(function(name) {
			what[name] = [];
		});
		
		return what;
	}
	
	function activatorApi(name, what) {
		return {
			add: function add() {
				what[name].push(arguments);
			}
		};
	}
	
	function createApi(activators, what) {
		var api = { activators: activatorApi("activators", what) };
		
		Object.keys(activators).forEach(function(name) {
			api[name] = activatorApi(name, what);
		});
		
		return api;
	}
	
	function install(activators, plugin) {
		var what = createWhat(activators),
			api = createApi(activators, what);
		
		plugin.install(api);
	
		return what;
	}
	
	Plugins.prototype.activate = function activate(name) {
		var plugin = plugins[name],
			what = plugin.what,
			self = this;
	
		if(!plugin) throw new Error('No such plugin: ' + name);
	
		if(!plugin.installed) what = plugin.what = install(this.activators, plugin);
		
		Object.keys(what).forEach(function(name) {
			if(name === 'activators') {
				what[name].forEach(function(activator) {
					self.activators[activator[0]] = activator[1];
				});
			} else {
				var activator = self.activators[name];
				
				if(activator) {
					what[name].forEach(function(args) {
						activator.activate(self.doc, args);
					});
				} else {
					console.warn('Unable to activate: %s', name);
				}
			}
		});
	
		return this;
	};
	
	Plugins.prototype.deactivate = function deactivate(name) {
		var plugin = plugins[name],
			what = plugin.what,
			self = this;
	
		if(!plugin) throw new Error('No such plugin: ' + name);
	
		if(!plugin.installed) what = plugin.what = install(this.activators, plugin);
	
		/*Object.keys(what.tags) // should have it's own plugin system
			.forEach(function(name) {
				this.doc.tags.add(name, what.tags[name]);
			});*/
		
		Object.keys(what).forEach(function(name) {
			if(name === 'activators') {
				what[name].forEach(function(activator) {
					delete self.activators[activator[0]];
				});
			} else {
				var activator = this.activators[name];
				
				if(activator) {
					activator.deactivate(doc, what[name]);
				} else {
					console.warn('Unable to activate: %s', name);
				}
			}
		});
	
		return this;
	};
	
	return Plugins;
})();
