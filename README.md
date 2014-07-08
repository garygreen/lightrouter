Lightrouter
===========

Ultra lightweight javascript router (less than 300 bytes gzipped), for those that need the most basic simple javascripting routing.

## Usage

```javascript
// Initialise the router
var router = new LightRouter({
	routes: {
		''                        : function() { // Just the root },
		'^([#\\?].*)?$'           : function() { // Root with allowed query strings and hashbangs },
		'test/in-url'             : function() { // In url matched },
		'^test/absolute-from-root': function() { // Absolute url matched }
	},
	rootUrl: 'http://localhost/my-app/path'
});

// Run the routes
router.run();
```

The the routes key is a regex that will be matched against the windows current full url (without the rootUrl). If the route matches, the function will be called. Simple.

Available Functions
---

### setRoutes([object]routes)
Set's the routes (see above example)

### setRootUrl([string]url)
Set's the route url