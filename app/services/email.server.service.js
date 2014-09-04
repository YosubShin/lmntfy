'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose-q')(require('mongoose')),
    Action = mongoose.model('Action'),
    util = require('util'),
    Q = require('q'),
    _ = require('lodash');

exports.execute = function(action) {
    var deferred = Q.defer();
    // TODO Do actual execution of action and return Q promise.

    return deferred.promise;    
};

exports.createAction = function(script, actionConfig, result) {
    var action = new Action({script: script._id});
    // TODO save Action into persistance layer
    return action;
};
