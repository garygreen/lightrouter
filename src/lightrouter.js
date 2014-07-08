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
 * Get the url to test against the routes (current window href location minus the rootUrl)
 * @return string
 */
LightRouter.prototype.getUrl = function() {
	var	rootRegex = new RegExp('^' + this.rootUrl);
	return window.location.href.replace(rootRegex, '');
};

/**
 * Run the router
 * @return self
 */
LightRouter.prototype.run = function() {
	var url = this.getUrl(), i, route;

	for (i in this.routes)
	{
		route = this.routes[i];
		if (url.match(route))
		{
			this.routes[route]();
		}
	}
	return this;
};