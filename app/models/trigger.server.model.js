'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var states = 'created working finished failed';

/**
 * Trigger Schema
 */
var TriggerSchema = new Schema({
    created: {
	type: Date,
	default: Date.now
    },
    triggerAt: {
	type: Date,
	default: Date.now
    },
    script: {
	type: Schema.ObjectId,
        ref: 'Script'
    },
    state: {
        type: String,
        enum: states.split(' ')
    },
    message: {
        type: String,
        default: '',
        trim: true
    }
});

mongoose.model('Trigger', TriggerSchema);
