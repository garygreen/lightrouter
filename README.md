Lightrouter
===========

[![Build Status](https://api.travis-ci.org/garygreen/lightrouter.svg)](https://travis-ci.org/garygreen/lightrouter)

Ultra lightweight javascript router for those that need the most basic simple javascript routing.


```javascript
// Initialise the router
var router = new LightRouter({
	type: 'path', // Default
	routes: {
		'':                              function() { console.log('the base url'); },
		'articles':                      function() { console.log('loading articles'); },
		'articles/{id}':                 function(params) { console.log('showing article: ', params.id); }
		'articles/(?:create|{id}/edit)': function(params) { console.log('create or edit article', params.id); }
	},
	pathRoot: 'my-app/path'
});

// Run the router
router.run();
```

## Features

* Super fast, regexes and objects are only initialized when they need to be.
* Predictable and easy regex-based, no new syntax to learn.
* Most routers use `:param` style syntax which interfers with regexes non-consuming match `(?:`
* Node support
* Support for matching from a base path (see `pathRoot`).
* Traditional URL matching and support for hash based routing for single page apps.
* Fully unit tested.

#### Adding routes

Routes can be added with the `add()` method

```javascript
router.add(/anywhere-in-url-match\/(\w+)/, function(params) { });
router.add('articles/{id}', function(params) { console.log('loading article ' + params.id); });
router.add('user/{userId}/show', function(params) { console.log('showing user', params.userId); });
```

#### Routing Types

 Type   | Matches Against
 -------|----------------------------
 path   | window.location.pathname
 hash   | window.location.hash

### Base/Path Root Support

The given `pathRoot` will be essentially stripped out when matching the routes:

```javascript
// Initialise the router
var router = new LightRouter({
	type: 'path',
	path: 'my-app-path/users/1',
	pathRoot: 'my-app-path',
	routes: {
		'users/{id}': function(params) { console.log('showing user', params.id); }
	}
}).run();
```


API
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
