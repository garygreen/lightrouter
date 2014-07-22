(function() {

	var assert, lightrouter;

	if (typeof require !== 'undefined')
	{
		assert      = require('chai').assert,
		lightrouter = require('../src/lightrouter.js');
	}
	else
	{
		// Browser testing support
		assert      = window.chai.assert;
		lightrouter = {
			LightRouter: window.LightRouter
		};
	}


	describe('initialisation', function() {

		it('should be able to initialise the router', function() {

			var router = new lightrouter.LightRouter();

		});

		it('should be able to initialise routes and root url', function() {

			var router = new lightrouter.LightRouter({
				routes: {
					'route1/test': function() { },
					'route2/test2': function() { }
				},
				pathRoot: 'path/to/app'
			});

			assert.lengthOf(router.routes, 2);
			assert.equal(router.pathRoot, 'path/to/app');

		});

	});


	describe('function tests', function() {

		it('can getUrl() and remove the root', function() {

			var router = new lightrouter.LightRouter({
	 			path: 'my/app/path/test/123',
	 			pathRoot: 'my/app/path'
	 		});

	 		assert.equal(router.getUrl(), 'test/123');

		});

		it('can getUrl() a specific routing type', function() {

			var router = new lightrouter.LightRouter({
				path: 'app/path/test-path',
				hash: 'test-hash',
				pathRoot: 'app/path'
			});

			assert.equal(router.getUrl('path'), 'test-path');
			assert.equal(router.getUrl('hash'), 'test-hash');
		});

		it('add manual routes', function(done) {

			var router = new lightrouter.LightRouter({ path: 'articles/123' });

			var unmatchCallback = function() {
				throw('should not have called this.');
			};

			var matchCallback = function(id) {
				assert.equal(id, '123');
				done();
			};

			router.add('blogs/:id', unmatchCallback);
			router.add('articles/:id', matchCallback);
			router.run();

		});

		it('can set a manual path', function() {
			var router = new lightrouter.LightRouter();
			router.setPath('test/blah');
			assert.equal(router.path, 'test/blah');
		});

		it('can set a root url', function() {
			var router = new lightrouter.LightRouter(),	
				pathRoot = 'my/app/path';
			router.setPathRoot(pathRoot);
			assert.equal(router.pathRoot, pathRoot);
		});

		it('can set a hash routing type', function() {

			var router = new lightrouter.LightRouter({
				hash: 'articles/456'
			});

			router.setType('hash');
			assert.equal(router.type, 'hash');
			assert.equal(router.getUrl(), 'articles/456');

		});

		it('can set a location routing type', function() {

			var router = new lightrouter.LightRouter({
				path: 'articles/456'
			});

			router.setType('path');
			assert.equal(router.type, 'path');
			assert.equal(router.getUrl(), 'articles/456');

		});

		it('can empty all the routes', function() {

			var router = new lightrouter.LightRouter({
				routes: {
					'test1': function() { },
					'test2': function() { }
				}
			});

			assert.lengthOf(router.routes, 2);
			router.empty();
			assert.lengthOf(router.routes, 0);

		});

	});


	describe('general route testing', function() {

	 	it('should match index', function(done) {

	 		var router = new lightrouter.LightRouter({
	 			path: 'my/app/path',
	 			pathRoot: 'my/app/path',
	 			routes: {
	 				'': function() { done(); }
	 			}
	 		}).run();

	 	});

	 	it('should perform exact matching of route', function(done) {

	 		var router = new lightrouter.LightRouter({
	 			path: 'my/app/path/test-123/blah',
	 			pathRoot: 'my/app/path',
	 			routes: {
	 				'test-123/bla': function() {
	 					throw('should not have called this');
	 				},
	 				'est-123/blah': function() {
	 					throw('should not have called this');
	 				},
	 				'test-123/blah': function() { done(); }
	 			}
	 		}).run();

	 	});

	 	it('should be case sensitive by default', function(done) {

	 		var router = new lightrouter.LightRouter({
	 			path: 'my/app/path/testCAsE/3',
	 			pathRoot: 'my/app/path',
	 			routes: {
	 				'testcase': function() {
	 					throw('should not have called this');
	 				},
	 				'testCAsE/(\\d+)$': function() { done(); }
	 			}
	 		}).run();

	 	});

	 	it('should allow adding of manual route regex with case insensitivity', function(done) {

	 		var router = new lightrouter.LightRouter({
	 			path: 'my/app/path/testCAsE/3',
	 			pathRoot: 'my/app/path'
	 		});

	 		router
	 			.add(/^testcase/i, function() { done(); })
	 			.add(/testcasE/, function() {
	 				throw('should not have called this');
	 			})
	 			.run();
	 	});

	 	it('should match route parameters simple', function(done) {

	 		var router = new lightrouter.LightRouter({
	 			pathRoot: 'my/app/path%20test',
	 			path: 'my/app/path%20test/articles/some%20category%20_785/4463',
	 			routes: {
	 				'articles/:category/:id': function(category, id) {
	 					assert.equal(category, 'some%20category%20_785');
	 					assert.equal(id, 4463);
	 					done();
	 				}
	 			}
	 		}).run();

	 	});

	 	it('should match route parameters advanced', function(done) {

	 		var router = new lightrouter.LightRouter({
	 			pathRoot: 'my/app/path%20test',
	 			path: 'my/app/path%20test/articles/create'
	 		});
	 		router.add(/articles\/(?:create|edit\/(\d+))/, function(id) {
	 			assert.isUndefined(id);
	 		})
	 		.run()
	 		.empty()
	 		.setPath('my/app/path%20test/articles/edit/789')
	 		router.add(/articles\/(?:create|edit\/(\d+))/, function(id) {
	 			assert.equal(id, 789);
	 			done();
	 		})
	 		.run();

	 	});

	});

	describe('hash route testing specifics', function() {

		it('should not attempt to replace path root url when hash routing', function() {

			var router = new lightrouter.LightRouter({
				hash: 'articles/123',
				type: 'hash',
				pathRoot: 'articles'
			});

			assert.equal(router.getUrl(), 'articles/123');

		});

	});

})();