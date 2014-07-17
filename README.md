Lightrouter
===========

[![Build Status](https://api.travis-ci.org/garygreen/lightrouter.svg)](https://api.travis-ci.org/garygreen)

Ultra lightweight javascript router for those that need the most basic simple javascript routing.

## Usage

```javascript
// Initialise the router
var router = new LightRouter({
	routes: {
		'$'                       : function() { // Just the root },
		'test/in-url'             : function() { // In url matched },
		'test/absolute-from-root$': function() { // Absolute url matched }
	},
	rootUrl: 'http://localhost/my-app/path'
});

// Run the routes
router.run();
```

The the routes key is a regex that will be matched against the windows current full url (without the rootUrl). If the route matches, the function will be called. Simple.

Available Functions
---

### addRoute([string|regex], [function]callFunc)
Adds a route and calls the function if the routing url matches.

### setRootUrl([string]url)
Set's the route url

### setUrl([string]url)
Set's the url to match routes against (will default to the window.href location)

### getUrl()
Get's the rootless url to match routes against

### run()
Checks the routes against the url and calls the associated route function.