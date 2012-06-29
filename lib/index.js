var _ = require('underscore')
    , config = require('./config')
    , argv = require('optimist')
        .default('port',config.PORT)
            .describe('set the port the server should run on.')
        .argv

// bypass select configuration options with commandline arguments
var env = process.env.NODE_ENV || 'development';
if(env==='production') _.extend(config,config.production);
else _.extend(config,config.development);
config.ENV = env;
config.PORT = argv['port'];

var log = require('./log'); //init the with the configuration options

require('./app').listen(config.PORT);

log.notice('listening on port: '+config.PORT);