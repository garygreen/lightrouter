/*
 *  Copyright 2014 Gary Green.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

(function(factory) {

	if (typeof exports !== 'undefined')
	{
		module.exports = factory();
	}
	else
	{
		window.LightRouter = factory(window);
	}

}(function(window) {

	function LightRouter(options)
	{
		/**
		 * Path root (will be stripped out when testing path-based routes)
		 * @type string
		 */
		this.pathRoot = '';

		/**
		 * Routes
		 * @type array
		 */
		this.routes = [];

		/**
		 * Default routing type [hash or path]
		 * @type string
		 */
		this.type = 'path';

		/**
		 * Custom path (mainly used for testing)
		 * @type string
		 */
		this.path = null;

		/**
		 * Custom hash (mainly used for testing)
		 * @type string
		 */
		this.hash = null;

		/**
		 * Context to call matched routes under
		 * @type {mixed}
		 */
		this.context = this;

		/**
		 * Handler for string based callbacks
		 * @type {object|function}
		 */
		this.handler = window;

		/**
		 * Named param replace and matching regex
		 * @type {Object}
		 */
		var namedParam = '([\\w-]+)';
		this.namedParam = {
			match: new RegExp('{(' + namedParam + ')}', 'g'),
			replace: namedParam
		};

		options = options || {};

		if (options.type)      this.setType(options.type);
		if (options.path)      this.setPath(options.path);
		if (options.pathRoot)  this.setPathRoot(options.pathRoot);
		if (options.hash)      this.setHash(options.hash);
		if (options.context)   this.setContext(options.context);
		if (options.handler)   this.setHandler(options.handler);

		if (options.routes)
		{
			var route;
			for (route in options.routes)
			{
				this.add(route, options.routes[route]);
			}
		}
	}

	LightRouter.prototype = {

		/**
		 * Route constructor
		 * @type {Route}
		 */
		Route: Route,

		/**
		 * Add a route
		 * @param string|RegExp   route
		 * @param string|function callback
		 * @return self
		 */
		add: function(route, callback) {
			this.routes.push(new this.Route(route, callback, this));
			return this;
		},


		/**
		 * Empty/clear all the routes
		 * @return self
		 */
		empty: function() {
			this.routes = [];
			return this;
		},

		/**
		 * Set's the routing type
		 * @param self
		 */
		setType: function(type) {
			this.type = type;
			return this;
		},

		/**
		 * Set the path root url
		 * @param string url
		 * @return self
		 */
		setPathRoot: function(url) {
			this.pathRoot = url;
			return this;
		},

		/**
		 * Sets the custom path to test routes against
		 * @param  string path
		 * @return self
		 */
		setPath: function(path) {
			this.path = path;
			return this;
		},

		/**
		 * Sets the custom hash to test routes against
		 * @param  string hash
		 * @return self
		 */
		setHash: function(hash) {
			this.hash = hash;
			return this;
		},

		/**
		 * Sets context to call matched routes under
		 * @param  mixed context
		 * @return self
		 */
		setContext: function(context) {
			this.context = context;
			return this;
		},

		/**
		 * Set handler
		 * @param  mixed context
		 * @return self
		 */
		setHandler: function(handler) {
			this.handler = handler;
			return this;
		},

		/**
		 * Gets the url to test the routes against
		 * @return self
		 */
		getUrl: function(routeType) {

			var url;
			routeType = routeType || this.type;

			if (routeType == 'path')
			{
				var rootRegex = new RegExp('^' + this.pathRoot + '/?');
				url = this.path || window.location.pathname.substring(1);
				url = url.replace(rootRegex, '');
			}
			else if (routeType == 'hash')
			{
				url = this.hash || window.location.hash.substring(1);
			}
				
			return decodeURI(url);
		},

		/**
		 * Attempt to match a one-time route and callback
		 *
		 * @param  {string} path
		 * @param  {closure|string} callback
		 * @return {mixed}
		 */
		match: function(path, callback) {
			var route = new this.Route(path, callback, this);
			if (route.test(this.getUrl()))
			{
				return route.run();
			}
		},

		/**
		 * Run the router
		 * @return Route|undefined
		 */
		run: function() {
			var url = this.getUrl(), route;

			for (var i in this.routes)
			{
				// Get the route
				route = this.routes[i];

				// Test and run the route if it matches
				if (route.test(url))
				{
					route.run();
					return route;
				}
			}
		}
	};


	/**
	 * Route object
	 * @param {string} path
	 * @param {string} closure
	 * @param {LightRouter} router  Instance of the light router the route belongs to.
	 */
	function Route(path, callback, router)
	{
		this.path = path;
		this.callback = callback;
		this.router = router;
		this.values = [];
	}

	Route.prototype = {

		/**
		 * Converts route to a regex (if required) so that it's suitable for matching against.
		 * @param  string route
		 * @return RegExp
		 */
		regex: function() {

			var path = this.path;

			if (typeof path === 'string')
			{
				return new RegExp('^' + path.replace(/\//g, '\\/').replace(this.router.namedParam.match, this.router.namedParam.replace) + '$');
			}
			return path;
		},

		/**
		 * Get the matching param keys
		 * @return object  Object keyed with param name (or index) with the value.
		 */
		params: function() {

			var obj = {}, name, values = this.values, params = values, i, t = 0, path = this.path;

			if (typeof path === 'string')
			{
				t = 1;
				params = path.match(this.router.namedParam.match);
			}
			
			for (i in params)
			{
				name = t ? params[i].replace(this.router.namedParam.match, '$1') : i;
				obj[name] = values[i];
			}

			return obj;
		},

		/**
		 * Test the route to see if it matches
		 * @param  {string} url Url to match against
		 * @return {boolean}
		 */
		test: function(url) {
			var matches;
			if (matches = url.match(this.regex()))
			{
				this.values = matches.slice(1);
				return true;
			}
			return false;
		},

		/**
		 * Run the route callback with the matched params
		 * @return {mixed}
		 */
		run: function() {
			if (typeof this.callback === 'string')
			{
				return this.router.handler[this.callback](this.params());
			}
			return this.callback.apply(this.router.context, [this.params()]);
		}
	};

	return LightRouter;

}));