'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose-q')(require('mongoose')),
    Script = mongoose.model('Script'),
    Action = mongoose.model('Action'),
    email = require('../../app/services/email'),
    util = require('util'),
    Q = require('q'),
    _ = require('lodash');

var actionHandlers = {
    email: email
};

function getActionHandler(type) {
    if (!actionHandlers.type) {
        throw new Error('No Action Handler of type ' + type);
    }
    return actionHandlers.type;
}

function doAction(action) {
    var actionHandler = getActionHandler(action.type);
    return actionHandler.execute(action);
}

function createActions(script, result) {
    var actions = [];
    if (!script.actionConfigs) {
        console.log('No actions to be created...');
        return;
    }
    var i = 0, len = script.actionConfigs.length;
    for ( ; i < len ; i++) {
        var actionConfig = script.actionConfigs[i];
        var actionHandler = getActionHandler(actionConfig.type);
        actions.push(actionHandler.createAction(script, actionConfig, result));
    }
    return actions;
}

function execute(script, result) {
    var actions = createActions(script, result);
    return Q.all(actions.map(doAction));
}
exports.execute = execute;
