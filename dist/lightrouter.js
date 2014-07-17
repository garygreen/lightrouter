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

(function(window) {

	function LightRouter(options)
	{
		/**
		 * Root url (will be stripped out when testing roots)
		 * @type {String}
		 */
		this.rootUrl = '';

		/**
		 * Routes
		 * @type {Object}
		 */
		this.routes = {};

		options = options || {};

		if (options.routes)
		{
			this.setRoutes(options.routes);
		}

		if (options.rootUrl)
		{
			this.setRootUrl(options.rootUrl);
		}
	}

	/**
	 * Set the routes
	 * @param object routes
	 * @return self
	 */
	LightRouter.prototype.setRoutes = function(routes) {
		this.routes = routes;
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
	 * Get the url to test against the routes (current window href location minus the rootUrl and query string)
	 * @return string
	 */
	LightRouter.prototype.getUrl = function() {
		var href        = window.location.href.split('?')[0],
		    rootRegex   = new RegExp('^' + this.rootUrl);
			
		return href.replace(rootRegex, '');
	};

	/**
	 * Run the router
	 * @return self
	 */
	LightRouter.prototype.run = function() {
		var url = this.getUrl(), route, matched;

		for (route in this.routes)
		{
			matched = url.match(route);
			if (matched)
			{
				this.routes[route]();
			}
		}
		return this;
	};

})(window);