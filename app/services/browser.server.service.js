'use strict';

/**
 * Module dependencies.
 */
var util = require('util'),
    Q = require('q');

var database = {};
var deferredMap = {};

try {
    var Spooky = require('spooky');
} catch (e) {
    var Spooky = require('../lib/spooky');
}

var theScript = 
        '(function(){console.log(\'Here I am the injected script! \' + document.location);' + 
        'console.log(\'database : \' + JSON.stringify(database));' +
        'database.newKey = \'New Value\';' +
        'return null;})();';


exports.run = function(script, trigger) {
    console.log('Running script %j, for trigger %j', script, trigger);
    var deferred = Q.defer();
    var spooky = new Spooky({
        child: {
            transport: 'http'
        },
        casper: {
            logLevel: 'debug',
            verbose: true
        }
    }, function (err) {
        if (err) {
            console.error('Unable to initialize SpookyJS, %j', err);
            var e = new Error('Failed to initialize SpookyJS');
            e.details = err;
            throw e;
        }

        // No error initializing SpookyJS
        if (!database[script._id]) {
            database[script._id] = {};
        }
        if (deferredMap[script._id]) {
            throw new Error('Does not expect deferred object for script id exists, but it is!');
        }
        deferredMap[script._id] = deferred;

        console.log('The script about to be executed:\n %s', script.content);

        spooky.start(script.url);
        spooky.then([{
            script: script,
            database: database[script._id]
        }, function () {
            // CasperJS's context
            var ret = this.evaluate(function (script, database) {
                // Client browser context
                try {
                    return {
                        result: eval(script),
                        database: database
                    };
                } catch (err) {
                    console.log('Error in browser : ' + err);
                    return {error : err};
                }
            }, {script: script.content, database: database});
            this.emit('scriptIsDone', ret, script._id);
        }]);
        spooky.run();
     });

    spooky.on('error', function (e, stack) {
        console.error(e);

        if (stack) {
            console.log(stack);
        }
    });

    spooky.on('console', function (line) {
        console.log(line);
    });

    spooky.on('log', function (log) {
        if (log.space === 'remote') {
            console.log(log.message.replace(/ \- .*/, ''));
        }
    });

    spooky.on('remote.message', function (msg) {
        console.log('[browser] ' + msg);
    });

    spooky.on('scriptIsDone', function(result, scriptId) {
        if (!scriptId || !deferredMap[scriptId]) {
            console.error('Script is done executing, but script does not exist. scriptId=%j', scriptId);
            return;
        }
        var deferred = deferredMap[scriptId];
        delete deferredMap[scriptId];
        console.log('Result from script :\n%j', result);
        if (!result) {
            deferred.reject('Result does not exists for executed script, %j', scriptId);
        } else if (result.error) {
            deferred.reject('Error occurred while executing the script. %j', result.error);
        } else if (!result.result || !result.database) {
            deferred.reject('result or database field does not exists for executed script, %j', result);
        } else {
            deferred.resolve(result.result);
        }        
    });
    return deferred.promise;
};
