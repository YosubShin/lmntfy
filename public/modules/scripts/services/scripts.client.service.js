'use strict';

//Scripts service used for communicating with the scripts REST endpoints
angular.module('scripts').factory('Scripts', ['$resource',
	function($resource) {
		return $resource('scripts/:scriptId', {
			scriptId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);
