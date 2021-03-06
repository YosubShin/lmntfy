'use strict';

(function() {
	// Scripts Controller Spec
	describe('ScriptsController', function() {
		// Initialize global variables
		var ScriptsController,
			scope,
			$httpBackend,
			$stateParams,
			$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Scripts controller.
			ScriptsController = $controller('ScriptsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one script object fetched from XHR', inject(function(Scripts) {
			// Create sample script using the Scripts service
			var sampleScript = new Scripts({
				title: 'An Script about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample scripts array that includes the new script
			var sampleScripts = [sampleScript];

			// Set GET response
			$httpBackend.expectGET('scripts').respond(sampleScripts);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.scripts).toEqualData(sampleScripts);
		}));

		it('$scope.findOne() should create an array with one script object fetched from XHR using a scriptId URL parameter', inject(function(Scripts) {
			// Define a sample script object
			var sampleScript = new Scripts({
				title: 'An Script about MEAN',
				content: 'MEAN rocks!'
			});

			// Set the URL parameter
			$stateParams.scriptId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/scripts\/([0-9a-fA-F]{24})$/).respond(sampleScript);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.script).toEqualData(sampleScript);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(Scripts) {
			// Create a sample script object
			var sampleScriptPostData = new Scripts({
				title: 'An Script about MEAN',
				content: 'MEAN rocks!'
			});

			// Create a sample script response
			var sampleScriptResponse = new Scripts({
				_id: '525cf20451979dea2c000001',
				title: 'An Script about MEAN',
				content: 'MEAN rocks!'
			});

			// Fixture mock form input values
			scope.title = 'An Script about MEAN';
			scope.content = 'MEAN rocks!';

			// Set POST response
			$httpBackend.expectPOST('scripts', sampleScriptPostData).respond(sampleScriptResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.title).toEqual('');
			expect(scope.content).toEqual('');

			// Test URL redirection after the script was created
			expect($location.path()).toBe('/scripts/' + sampleScriptResponse._id);
		}));

		it('$scope.update() should update a valid script', inject(function(Scripts) {
			// Define a sample script put data
			var sampleScriptPutData = new Scripts({
				_id: '525cf20451979dea2c000001',
				title: 'An Script about MEAN',
				content: 'MEAN Rocks!'
			});

			// Mock script in scope
			scope.script = sampleScriptPutData;

			// Set PUT response
			$httpBackend.expectPUT(/scripts\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/scripts/' + sampleScriptPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid scriptId and remove the script from the scope', inject(function(Scripts) {
			// Create new script object
			var sampleScript = new Scripts({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new scripts array and include the script
			scope.scripts = [sampleScript];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/scripts\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleScript);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.scripts.length).toBe(0);
		}));
	});
}());
