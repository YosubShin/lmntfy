'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose-q')(require('mongoose')),
    Script = mongoose.model('Script'),
    Trigger = mongoose.model('Trigger'),
    util = require('util'),
    Q = require('q'),
    _ = require('lodash');

function enqueue(rawTrigger) {    
    console.log('Engueuing trigger %j', rawTrigger);
    var deferred = Q.defer();
    var trigger = new Trigger(rawTrigger);
    trigger.saveQ()
        .then(function(result) {
            deferred.resolve(trigger);
        })
        .fail(function(err) {
            deferred.reject(err);
        })
        .done();
    return deferred.promise;
}
exports.enqueue = enqueue;

function execute(trigger) {
    console.log('Executing trigger %j', trigger);
    var deferred = Q.defer();
    // do something that takes some time

    //TODO resolve, or reject deferred object
    //TODO Do execute script
    console.log('TODO This is supposed to be actual work.');
    setTimeout(function() {
        trigger.state = 'finished';
        trigger.saveQ()
            .then(function(result) {
                return Script.findByIdQ(trigger.script);
            })
            .then(function(script) {
                return enqueue({
                    script: trigger.script, 
                    state: 'created', 
                    triggerAt: Date.now() + script.period * 1000, 
                    active: true
                });
            })
            .then(function(result) {
                deferred.resolve(trigger);
            })
            .fail(function(err) {
                deferred.reject(err);
            })
            .done();
    }, 1);

    return deferred.promise;
}

(function loop() {
    console.log('loop invoked at ' + new Date());
    Trigger
        .find({state: 'created'})
        .where('triggerAt').lt(Date.now())
        .sort('triggerAt')
        .limit(1)
        .execQ()
        .then(function(triggers) {
            var promises = [];
            triggers.forEach(function(trigger, index) {
                promises[index] = execute(trigger).timeout(10000);
            });
            return Q.allSettled(promises);
        })
        .then(function(results) {
            results.forEach(function (result) {
                if (result.state === 'fulfilled') {
                    console.log('Finished processing trigger ' + result.value);
                } else {
                    console.error('Error occurred while executing the trigger %j, with reason %j', result.value, result.reason);
                }
            });
        })
        .then(function() {
            //Recursively call itself to generate loop, use setTimeout to not grow stack
            setTimeout(loop, 1000);
        })
        .fail(function(err) {
            console.error('Error while fetching Triggers... Stopping the loop', err);
        })
        .done();
})();
