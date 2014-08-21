'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
    Script = mongoose.model('Script'),
    Trigger = mongoose.model('Trigger'),
    util = require('util'),
    Q = require('q'),
    _ = require('lodash');

function enqueue(rawTrigger) {    
    console.log('Engueuing trigger %j', rawTrigger);
    var deferred = Q.defer();
    var trigger = new Trigger(rawTrigger);
    trigger.save(function(err) {
        if (err) {
            deferred.reject(err);
        } else {
            deferred.resolve(trigger);
        }
    });
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
        trigger.save(function(err) {
            if (err) {
                console.error('Unable to update trigger into Database.');
                deferred.reject(err);
            } else {                
                console.log('Finished executing trigger');
                Script.findById(trigger.script, function(err, script) {
                    if (err) {
                        console.error('Unable to find script');
                        deferred.reject(err);
                    }
                    if (script.active === true) {
                        enqueue({
                            script: trigger.script, 
                            state: 'created', 
                            triggerAt: Date.now() + script.period * 1000, 
                            active: true
                        }).done(function() {
                            deferred.resolve(trigger);    
                        });
                    } else {
                        console.log('Script is not active, not enqueuing anymore...');
                        deferred.resolve(trigger);
                    }
                });
            }
        });
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
        .exec(function(err, triggers) {
            if (err) {
                console.error('Error while fetching Triggers', err);
            } else {
                var promises = [];
                for (var i = 0, len = triggers.length; i < len; ++i) {
                    var trigger = triggers[i];
                    promises[i] = execute(trigger).timeout(10000);
                }
                Q.allSettled(promises)
                    .then(function(results) {
                        results.forEach(function (result, index) {
                            if (result.state === 'fulfilled') {
                                console.log('Finished processing trigger ' + result.value);
                            } else {
                                console.error('Error occurred while executing the trigger %j, with reason %j', triggers[index], result.reason);
                            }
                        });
                    }).then(function() {
                        //Recursively call itself to generate loop, use setTimeout to not grow stack
                        setTimeout(loop, 1000);
                    });
            }
        });
})();
