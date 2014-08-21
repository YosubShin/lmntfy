'use strict';

/**
 * Module dependencies.
 */
var users = require('../../app/controllers/users'),
	scripts = require('../../app/controllers/scripts');

module.exports = function(app) {
	// Script Routes
	app.route('/scripts')
		.get(scripts.list)
		.post(users.requiresLogin, scripts.create);

	app.route('/scripts/:scriptId')
		.get(scripts.read)
		.put(users.requiresLogin, scripts.hasAuthorization, scripts.update)
		.delete(users.requiresLogin, scripts.hasAuthorization, scripts.delete);

	// Finish by binding the script middleware
	app.param('scriptId', scripts.scriptByID);
};
