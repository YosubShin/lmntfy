'use strict';

angular.module('scripts').controller('ScriptsController', ['$scope', '$stateParams', '$location', 'Authentication', 'Scripts',
	function($scope, $stateParams, $location, Authentication, Scripts) {
		$scope.authentication = Authentication;

		$scope.create = function() {
			var script = new Scripts({
				title: this.title,
                                period: this.period,
                                url: this.url,
				content: this.content
			});
			script.$save(function(response) {
				$location.path('scripts/' + response._id);

				$scope.title = '';
                                $scope.period = '';
                                $scope.url = '';
				$scope.content = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.remove = function(script) {
			if (script) {
				script.$remove();

				for (var i in $scope.scripts) {
					if ($scope.scripts[i] === script) {
						$scope.scripts.splice(i, 1);
					}
				}
			} else {
				$scope.script.$remove(function() {
					$location.path('scripts');
				});
			}
		};

		$scope.update = function() {
			var script = $scope.script;

			script.$update(function() {
				$location.path('scripts/' + script._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		$scope.find = function() {
			$scope.scripts = Scripts.query();
		};

		$scope.findOne = function() {
			$scope.script = Scripts.get({
				scriptId: $stateParams.scriptId
			});
		};
	}
]);

/*
 Take a look at the link to see how to enable syntax highlight in AngularJS
 @link http://stackoverflow.com/questions/22742899/using-prismjs-in-angular-app
*/
angular.module('scripts').directive('nagPrism', ['$compile', '$timeout', function($compile, $timeout) {
    return {
        restrict: 'A',
        transclude: true,
        scope: {
          source: '@',
          code: '@'
        },
        link: function(scope, element, attrs, controller, transclude) {
            scope.$watch('source', function(v) {
              element.find('code').html(v);
                
              Prism.highlightElement(element.find('code')[0]);
            });
        },
        template: '<code></code>'
    };
}]);
