
module.exports = {
    // these are the default options. they can be overwritten by command line 
    // arguments
    PORT : 3040
    , DATABASE_URL : 'mongodb://localhost/test'
    , development : {
        log : {
            TRANSPORTS : ['console']
            , LEVEL : 'debug'
        }
        , loggly : {
            SUBDOMAIN : 'yinzcam'
            // 'dashboard-dev' loggly input
            , INPUT_TOKEN : '8b80d613-f87e-4e75-9308-9c1344c54ee8'
        }
    }
    , production : {
        log : {
            TRANSPORTS : ['console','loggly']
            , LEVEL : 'info'
        }
        , loggly : {
            SUBDOMAIN : 'yinzcam'
            // @TODO setup loggly input token
            // , INPUT_TOKEN : ''
        }
    }
}