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
		module.exports = {
			LightRouter: factory()
		};
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
		 * Named param replace and matching regex
		 * @type {Object}
		 */
		var namedParam = '([\\w-]+)';
		this.namedParam = {
			replace: new RegExp(':' + namedParam, 'g'),
			match: namedParam
		};

		options = options || {};

		if (options.type)      this.setType(options.type);
		if (options.path)      this.setPath(options.path);
		if (options.pathRoot)  this.setPathRoot(options.pathRoot);
		if (options.hash)      this.setHash(options.hash);

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
		 * Add a route
		 * @param string|RegExp   route
		 * @param function        callback
		 * @return self
		 */
		add: function(route, callback) {
			this.routes.push({
				route: route,
				callback: callback
			});
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
		 * Converts the given route string to a regex, suitable for matching against.
		 * @param  string route
		 * @return RegExp
		 */
		regexRoute: function(route) {
			if (typeof route === 'string')
			{
				return new RegExp('^' + route.replace(/\//g, '\\/').replace(this.namedParam.replace, this.namedParam.match) + '$');
			}
			return route;
		},

		/**
		 * Gets the url to test the routes against
		 * @return self
		 */
		getUrl: function(routeType) {

			var url;

			if (routeType === undefined)
			{
				routeType = this.type;
			}

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
		 * Run the router
		 * @return self
		 */
		run: function() {
			var url = this.getUrl(), i, matched, routeOptions, routeRegex;

			for (i in this.routes)
			{
				routeOptions = this.routes[i];
				routeRegex = this.regexRoute(routeOptions.route);
				matched = url.match(routeRegex);

				if (matched)
				{
					routeOptions.callback.apply(undefined, matched.slice(1));
				}
			}
			return this;
		}
	};

	return LightRouter;

}));