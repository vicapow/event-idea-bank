
var winston = require('winston')
    , config = require('./config')
    , _ = require('underscore')

winston.setLevels(winston.config.syslog.levels);

if(_.contains(config.log.TRANSPORTS,'loggly')){
    // only log to the loggly transport
    winston.add(winston.transports.Loggly, {
        level : config.log.LEVEL
        , subdomain : config.loggly.SUBDOMAIN
        , inputToken : config.loggly.INPUT_TOKEN
        , json : true
    });
}

// the console log transport is added by default so we need to remove it
// if we don't want it around
winston.remove(winston.transports.Console);
if(_.contains(config.log.TRANSPORTS,'console')){
    winston.add(winston.transports.Console,{
        level : config.log.LEVEL
        , colorize : true
        , timestamp : true
    });
}

module.exports = winston;