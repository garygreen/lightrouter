(function() {

	var assert, Lightrouter;

	if (typeof require !== 'undefined')
	{
		assert      = require('chai').assert,
		Lightrouter = require('../src/lightrouter.js');
	}
	else
	{
		// Browser testing support
		assert      = window.chai.assert;
		Lightrouter = window.LightRouter;
	}


	describe('initialisation', function() {

		it('should be able to initialise the router', function() {

			var router = new Lightrouter();

		});


		it('should be able to initialise routes and root url', function() {

			var router = new Lightrouter({
				routes: {
					'route1/test': function() { },
					'route2/test2': function() { }
				},
				pathRoot: 'path/to/app'
			});

			assert.lengthOf(router.routes, 2);
			assert.equal(router.pathRoot, 'path/to/app');

		});


		it('should default to path based routing', function() {

			var router = new Lightrouter();
			assert(router.type, 'path');

		});

	});


	describe('function tests', function() {

		it('can getUrl() and remove the root', function() {

			var router = new Lightrouter({
	 			path: 'my/app/path/test/123',
	 			pathRoot: 'my/app/path'
	 		});

	 		assert.equal(router.getUrl(), 'test/123');

		});


		it('can getUrl() a specific routing type', function() {

			var router = new Lightrouter({
				path: 'app/path/test-path',
				hash: 'test-hash',
				pathRoot: 'app/path'
			});

			assert.equal(router.getUrl('path'), 'test-path');
			assert.equal(router.getUrl('hash'), 'test-hash');
		});


		it('getUrl() should decode the url', function() {

			var router = new Lightrouter({
	 			pathRoot: 'my/app/path%20test',
	 			path: 'my/app/path%20test/articles/some%20category%20name/email@address.com'
	 		});

	 		assert(router.getUrl(), 'my/app/path test/articles/some category name/email@address.com');

	 	});


		it('add manual routes', function(done) {

			var router = new Lightrouter({ path: 'articles/123' });

			var unmatchCallback = function() {
				throw('should not have called this.');
			};

			var matchCallback = function(params) {
				assert.equal(params.id, '123');
				done();
			};

			router.add('blogs/{id}', unmatchCallback);
			router.add('articles/{id}', matchCallback);
			router.run();

		});


		it('can set a manual path', function() {
			var router = new Lightrouter();
			assert.equal(router.setPath('test/blah'), router);
			assert.equal(router.path, 'test/blah');
		});


		it('can set a root url', function() {
			var router = new Lightrouter(),	
				pathRoot = 'my/app/path';
			assert.equal(router.setPathRoot(pathRoot), router);
			assert.equal(router.pathRoot, pathRoot);
		});


		it('can set a hash routing type', function() {

			var router = new Lightrouter({
				hash: 'articles/456'
			});

			assert.equal(router.setType('hash'), router);
			assert.equal(router.type, 'hash');
			assert.equal(router.getUrl(), 'articles/456');

		});


		it('can set a location routing type', function() {

			var router = new Lightrouter({
				path: 'articles/456'
			});

			router.setType('path');
			assert.equal(router.type, 'path');
			assert.equal(router.getUrl(), 'articles/456');

		});


		it('can empty all the routes', function() {

			var router = new Lightrouter({
				routes: {
					'test1': function() { },
					'test2': function() { }
				}
			});

			assert.lengthOf(router.routes, 2);
			assert(router.empty(), router);
			assert.lengthOf(router.routes, 0);

		});


	});


	describe('context on route', function() {

		it('defaults to lightrouter as context', function() {

			var router = new Lightrouter({
				path: 'test',
				routes: {
					'test': function() { assert.instanceOf(this, Lightrouter); }
				}
			}).run();

		});


		it('can supply a context when running route', function(done) {

			var router = new Lightrouter({
				context: { success: done },
				path: 'test',
				routes: {
					'test': function() { this.success(); }
				}
			}).run();

		});

	});


	describe('general route testing', function() {


	 	it('should match index', function(done) {

	 		var router = new Lightrouter({
	 			path: 'my/app/path',
	 			pathRoot: 'my/app/path',
	 			routes: {
	 				'': function() { done(); }
	 			}
	 		}).run();

	 	});


	 	it('should perform exact matching of route', function(done) {

	 		var router = new Lightrouter({
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

	 		var router = new Lightrouter({
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

	 		var router = new Lightrouter({
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

	 });


	describe('route parameters', function() {

		it('should match alpha, digit, underscore or dash for named parameters by default', function(done) {

	 		var router = new Lightrouter({
	 			path: 'articles/some-Named-slug-23_2011!apple',
	 			routes: {
	 				'articles/{slug}!{fruit}': function(params) {
	 					assert.equal(params.slug, 'some-Named-slug-23_2011');
	 					assert.equal(params.fruit, 'apple');
	 					done();
	 				}
	 			}
	 		}).run();

	 	});


	 	it('should match path seperated route parameters', function(done) {

	 		var router = new Lightrouter({
	 			pathRoot: 'my/app/path-test',
	 			path: 'my/app/path-test/articles/some-category_NAME/4463',
	 			routes: {
	 				'articles/{category}/{id}': function(params) {
	 					assert.equal(params.category, 'some-category_NAME');
	 					assert.equal(params.id, 4463);
	 					done();
	 				}
	 			}
	 		}).run();

	 	});


	 	it('should match in brackets', function(done) {

	 		var router = new Lightrouter({
	 			pathRoot: 'my/app/path-test',
	 			path: 'my/app/path-test/articles/56/edit',
	 			routes: {
	 				'articles/(?:create|{id}/edit)': function(params) {
	 					assert.equal(params.id, 56);
	 					done();
	 				}
	 			}
	 		}).run();

	 	});

	 	it('should match route added with no params with empty object', function(done) {

	 		var router = new Lightrouter({
	 			pathRoot: 'my/app/path%20test',
	 			path: 'my/app/path%20test/articles/create',
	 			routes: {
	 				'articles\/(?:create|edit\/(?:\d+))': function(params) {
	 					assert.isObject(params);
	 					assert.equal(Object.keys(params), 0);
	 					done();
	 				}
	 			}
	 		}).run();
	 	});


	 	it('should match route manually added with no params with empty object', function(done) {

	 		var router = new Lightrouter({
	 			pathRoot: 'my/app/path%20test',
	 			path: 'my/app/path%20test/articles/create'
	 		});
	 		router.add(/articles\/(?:create|edit\/(?:\d+))/, function(params) {
	 			assert.isObject(params);
	 			assert.equal(Object.keys(params), 0);
	 			done();
	 		})
	 		.run();

	 	});


	 	it('should match route manually added regex with params', function(done) {
			
	 		var router = new Lightrouter({
				pathRoot: 'my/app/path%20test',
		 		path: 'my/app/path%20test/articles/edit/789/900'
		 	})

		 	router.add(/articles\/(?:create|edit\/(\d+))\/(\d+)/, function(params) {
		 		assert.isObject(params);
		 		assert.equal(params[0], 789);
		 		assert.equal(params[1], 900);
		 		done();
		 	})
		 	.run();
	 	});


	 	it('stops when it matches first route', function() {

	 		var matched = 0;
	 		var router = new Lightrouter({
	 			path: 'ab',
	 			routes: {
	 				'a.': function() { matched++; },
	 				'ab': function() { matched++; }
	 			}
	 		}).run();

	 		assert.equal(matched, 1);
	 	});


	 	it('passes matched route on run', function() {

	 		var matched = 0;
	 		var router = new Lightrouter({
	 			path: 'test1',
	 			routes: {
	 				'test0': function() { },
	 				'test1': function() { }
	 			}
	 		});
	 		
	 		var matchedRoute = router.run();
	 		assert.instanceOf(matchedRoute, router.Route);
	 	});

	});

	describe('hash route testing specifics', function() {

		it('should not attempt to replace path root url when hash routing', function() {

			var router = new Lightrouter({
				hash: 'articles/123',
				type: 'hash',
				pathRoot: 'articles'
			});

			assert.equal(router.getUrl(), 'articles/123');

		});

	});

})();