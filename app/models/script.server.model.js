'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var ActionConfigSchema = new Schema({
    type: {
        type: String
    },
    detail: {
        type: Schema.Types.Mixed
    }
});


/**
 * Script Schema
 */
var ScriptSchema = new Schema({
    created: {
	type: Date,
	default: Date.now
    },
    title: {
	type: String,
	default: '',
	trim: true,
	required: 'Title cannot be blank'
    },
    period: {
	type: Number,
	default: 1,
	required: 'Period cannot be blank'
    },
    url: {
	type: String,
	default: '',
	trim: true,
	required: 'url cannot be blank'
    },
    content: {
	type: String,
	default: '',
	trim: true
    },
    user: {
	type: Schema.ObjectId,
	ref: 'User'
    },
    active: {
        type: Boolean,
        default: false
    },
    database: {
        type: String,
        default: '{}'
    },
    actionConfigs: [ActionConfigSchema]
});

mongoose.model('Script', ScriptSchema);
