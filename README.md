Lightrouter
===========

[![Build Status](https://api.travis-ci.org/garygreen/lightrouter.svg)](https://travis-ci.org/garygreen/lightrouter)

Ultra lightweight javascript router for those that need the most basic simple javascript routing.

## Usage

```javascript
// Initialise the router
var router = new LightRouter({
	type: 'path', // Default
	routes: {
		'':             function()   { console.log('the base url'); },
		'articles':     function()   { console.log('loading articles'); },
		'articles/:id': function(id) { console.log('showing article: ' + id); }
		'articles/(?:create|edit/(\d+))': function(id) { console.log('create or edit article' + ) id; }
	},
	pathRoot: 'my-app/path'
});

// Run the routes
router.run();
```

The routes key is a regex that will be matched against the windows current full url (without the rootUrl). If the route matches, the function will be called.

Examples
---

#### Path based routing (default)

This routing type matches the routes once `run()` against the `window.location.pathname`

```javascript
var router = new LightRouter({
	type: 'path'
});

// Or set manually:
router.setType('path');
```

#### Hash based routing

This routing type matches the routes once `run()` against the `window.location.hash`

```javascript
var router = new LightRouter({
	type: 'hash'
});

// Or set manually:
router.setType('hash');
```

#### Adding routes manually

Routes can be added with the `add()` method

```javascript
// Add a custom regex based route:
router.add(/anywhere-in-url-match/(\w+)/, function(w) { });

// Add a regex based string:
router.add('articles/:id', function(id) { console.log('loading article ' + id); });

Available Functions
---

### add([string|regex], callFunc)
Adds a route and calls the function if the routing url matches.

### empty()
Empty's all the routes

### setType(['hash'|'path'])
Set's the default routing type to either by hash or path

### setPathRoot([string]url)
Set's the paths root url (the paths root url will be removed when matching against routes).

### setPath([string]path)
Set's the path to match routes against (will default to window.location.pathname)

### setHash([string]hash)
Set's the hash to match routes against (will default to window.location.hash)

### getUrl([type])
Get's the url to match routes against (will default to get the url on the default routing type as set in the options or by `setType()` or for the type if supplied.)

### run()
Checks the routes against the url and calls the associated route function.