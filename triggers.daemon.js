'use strict';

/**
 * Module dependencies.
 */
var glob = require('glob'),
    init = require('./config/init')(),
    config = require('./config/config'),
    mongoose = require('mongoose');

/**
 * Main application entry file.
 * Please note that the order of loading is important.
 */

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
    if (err) {
	console.error('\x1b[31m', 'Could not connect to MongoDB!');
	console.log(err);
    }
});

// Init the express application
var app = require('./config/express')(db);

console.log('Child process for triggers.daemon.js is invoked.');
var triggerService = require('./app/services/triggers.server.service.js');
triggerService.loop();
console.log('Child process for triggers.daemon.js is shutting down.');

