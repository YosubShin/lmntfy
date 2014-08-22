'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose-q')(require('mongoose')),
    errorHandler = require('./errors'),
    Script = mongoose.model('Script'),
    Trigger = mongoose.model('Trigger'),
    util = require('util'),
    _ = require('lodash'),
    triggerService = require('../../app/services/triggers');

/**
 * Create a script
 */
exports.create = function(req, res) {
    var script = new Script(req.body);
    script.user = req.user;
    //TODO TBD
    script.active = true;

    script.saveQ()
        .then(function(result) {
            var trigger = {script: script._id, state: 'created'};
            return triggerService.enqueue(trigger);
        })
        .then(function(trigger) {
            res.jsonp(script);
        })
        .fail(function(err) {
            return res.status(400).send({
		message: errorHandler.getErrorMessage(err)
	    }); 
        })
        .done();
};

/**
 * Show the current script
 */
exports.read = function(req, res) {
    console.log('Start reading script');
    var result = req.script.toObject();
    Trigger.find({script: req.script.id}).sort('-created').exec(function(err, triggers) {
        if (err) {
            console.log('About to send 400');
	    return res.status(400).send({
		message: errorHandler.getErrorMessage(err)
	    });
	} else {
            console.log('About to send 200 response');
            result.triggers = triggers;
            res.jsonp(result);
	}
    });
};

/**
 * Update a script
 */
exports.update = function(req, res) {
    var script = req.script;

    script = _.extend(script, req.body);

    script.save(function(err) {
	if (err) {
	    return res.status(400).send({
		message: errorHandler.getErrorMessage(err)
	    });
	} else {
	    res.jsonp(script);
	}
    });
};

/**
 * Delete an script
 */
exports.delete = function(req, res) {
    var script = req.script;

    script.remove(function(err) {
	if (err) {
	    return res.status(400).send({
		message: errorHandler.getErrorMessage(err)
	    });
	} else {
	    res.jsonp(script);
	}
    });
};

/**
 * List of Scripts
 */
exports.list = function(req, res) {
    Script.find().sort('-created').populate('user', 'displayName').exec(function(err, scripts) {
	if (err) {
	    return res.status(400).send({
		message: errorHandler.getErrorMessage(err)
	    });
	} else {
	    res.jsonp(scripts);
	}
    });
};

/**
 * Script middleware
 */
exports.scriptByID = function(req, res, next, id) {
    Script.findById(id).populate('user', 'displayName').exec(function(err, script) {
	if (err) return next(err);
	if (!script) return next(new Error('Failed to load script ' + id));
	req.script = script;
	next();
    });
};

/**
 * Script authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
    if (req.script.user.id !== req.user.id) {
	return res.status(403).send({
	    message: 'User is not authorized'
	});
    }
    next();
};
