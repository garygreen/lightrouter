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
		 * Root url (will be stripped out when testing roots)
		 * @type {String}
		 */
		this.rootUrl = '';

		/**
		 * Routes
		 * @type array
		 */
		this.routes = [];

		/**
		 * Custom Url (mainly for testing, etc)
		 * @type {String}
		 */
		this.url = null;

		options = options || {};

		if (options.routes)
		{
			var route;
			for (route in options.routes)
			{
				this.addRoute(route, options.routes[route]);
			}
		}

		if (options.rootUrl)
		{
			this.setRootUrl(options.rootUrl);
		}

		if (options.url)
		{
			this.setUrl(options.url);
		}
	}

	function routeToRegex(route)
	{
		if (typeof route === 'string')
		{
			return new RegExp('^' + route);
		}
		return route;
	}

	LightRouter.prototype.addRoute = function(route, callback) {
		this.routes.push({
			route: route,
			callback: callback
		});
		return this;
	};

	/**
	 * Set the root url
	 * @param string url
	 * @return self
	 */
	LightRouter.prototype.setRootUrl = function(url) {
		this.rootUrl = url;
		return this;
	};

	/**
	 * Sets the custom url to test routes against
	 * @param  string url
	 * @return self
	 */
	LightRouter.prototype.setUrl = function(url) {
		this.url = url;
		return this;
	};

	/**
	 * Gets the rootless url (custom url or current window href)
	 * @return self
	 */
	LightRouter.prototype.getUrl = function() {

		var url       = this.url || window.location.href.split('?')[0],
		    rootRegex = new RegExp('^' + this.rootUrl);
			
		return url.replace(rootRegex, '');
	};

	/**
	 * Run the router
	 * @return self
	 */
	LightRouter.prototype.run = function() {
		var url = this.getUrl(), route, i, matched, routeOptions, routeRegex;

		for (i in this.routes)
		{
			routeOptions = this.routes[i];
			routeRegex = routeToRegex(routeOptions.route);
			matched = url.match(routeRegex);

			if (matched)
			{
				routeOptions.callback();
			}
		}
		return this;
	};

	return LightRouter;

}));