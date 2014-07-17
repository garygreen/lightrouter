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
				rootUrl: 'path/to/app'
			});

			assert.lengthOf(router.routes, 2);
			assert.equal(router.rootUrl, 'path/to/app');

		});

	});


	describe('function tests', function() {

		it('can getUrl and removes the root', function() {

			var router = new lightrouter.LightRouter({
	 			url: 'http://some-site.dev/my/app/path/test/123',
	 			rootUrl: 'http://some-site.dev/my/app/path/'
	 		});

	 		assert.equal(router.getUrl(), 'test/123');

		});

		it('add manual routes', function(done) {

			var router = new lightrouter.LightRouter({ url: 'test/123' });

			var unmatchCallback = function() {
				throw('should not have called this.');
			};

			var matchCallback = function() {
				done();
			};

			router.addRoute('test/xxx', unmatchCallback);
			router.addRoute('test/123', matchCallback);
			router.run();

		});

		it('can set a manual url', function() {
			var router = new lightrouter.LightRouter();
			router.setUrl('test/blah');
			assert.equal(router.url, 'test/blah');
		});

		it('can set a root url', function() {
			var router = new lightrouter.LightRouter(),	
				rootUrl = 'http://localhost/my/app/path';
			router.setRootUrl(rootUrl);
			assert.equal(router.rootUrl, rootUrl);
		});



	});


	describe('route testing', function() {

	 	it('should match index', function(done) {

	 		var router = new lightrouter.LightRouter({
	 			url: 'http://some-site.dev/my/app/path',
	 			rootUrl: 'http://some-site.dev/my/app/path',
	 			routes: {
	 				'$': function() {
	 					done();
	 				}
	 			}
	 		}).run();

	 	});

	 	it('should perform exact matching from of route', function(done) {

	 		var router = new lightrouter.LightRouter({
	 			url: 'http://some-site.dev/my/app/path/test-123/blah',
	 			rootUrl: 'http://some-site.dev/my/app/path/',
	 			routes: {
	 				'est-123/blah': function() {
	 					throw('should not have called this');
	 				},
	 				'test-123/blah': done
	 			}
	 		}).run();

	 	});

	 	it('should match in url, not exact by default', function(done) {

	 		var router = new lightrouter.LightRouter({
	 			url: 'http://some-site.dev/my/app/path/slug-in-url-test',
	 			rootUrl: 'http://some-site.dev/my/app/path/',
	 			routes: {
	 				'slug-in-url': done
	 			}
	 		}).run();

	 	});

	 	it('should support match exact ending', function(done) {

	 		var router = new lightrouter.LightRouter({
	 			url: 'http://some-site.dev/my/app/path/slug-in-url-test',
	 			rootUrl: 'http://some-site.dev/my/app/path/',
	 			routes: {
	 				'slug-in-url-test$': done,
	 				'slug-in-url$': function() {
	 					throw('should not have called this');
	 				},
	 			}
	 		}).run();

	 	});

	 	it('should be case sensitive by default', function(done) {

	 		var router = new lightrouter.LightRouter({
	 			url: 'http://some-site.dev/my/app/path/testCAsE/3',
	 			rootUrl: 'http://some-site.dev/my/app/path/',
	 			routes: {
	 				'testcase': function() {
	 					throw('should not have called this');
	 				},
	 				'testCAsE/(\\d+)$': done
	 			}
	 		}).run();

	 	});

	 	it('should allow adding of manual route regex with case insensitivity', function(done) {

	 		var router = new lightrouter.LightRouter({
	 			url: 'http://some-site.dev/my/app/path/testCAsE/3',
	 			rootUrl: 'http://some-site.dev/my/app/path/'
	 		});

	 		router
	 			.addRoute(/^testcase/i, done)
	 			.addRoute(/testcasE/, function() {
	 				throw('should not have called this');
	 			})
	 			.run();
	 	});

	});

})();