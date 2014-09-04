'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var states = 'created working finished failed';
var types = 'email';

/**
 * Action Schema
 */
var ActionSchema = new Schema({
    created: {
	type: Date,
	default: Date.now
    },
    type: {
        type: String,
        enum: types.split(' ')
    },
    script: {
	type: Schema.ObjectId,
        ref: 'Script'
    },
    state: {
        type: String,
        enum: states.split(' '),
        default: 'created'
    },
    message: {
        type: String,
        default: '',
        trim: true
    },
    detail: {
        type: Schema.Types.Mixed
    }
});

mongoose.model('Action', ActionSchema);
