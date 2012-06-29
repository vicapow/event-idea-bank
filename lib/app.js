var express = require('express')
    , _ = require('underscore')
    , log = require('./log')
    , config = require('./config')
    , app = module.exports = express.createServer()
    , MongoStore = require('connect-mongo')(express)


app.configure(function(){
    template(app);
    xPoweredBy(app,'YinzCam');
    //serve the default express favicon if one isn't found in the 'public' directory
    app.use(express.favicon());
    // Express sugar
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    // enables the use of hidden field "_method" : "put" to simulate the HTTP PUT and have app.put called acoordingly 
    // although we never seem to use it regardless
    app.use(express.methodOverride());
    // Authentication & Authorization
    auth(app);
    less(app);
    browserify(app);
    // server static resources from the 'public' directory
    app.use(express.static(__dirname + '/../public'));
    logging(app);
    // use the in-memory session store
    app.use(express.session({
        secret : config.COOKIE_SECRET
        , store : new MongoStore({ url : config.DATABASE_URL })
    }));
    // place third party routes here (probably none for new projects)
    app.use(app.router);
    // set our app routes
    require('./routes')(app);
    // catch the errors we know how to handle
    //app.use(require('./errors'));
    // what to do when we get an error we cant handle...
    errorHandling(app);
    // expose helpers to our templates
    //require('./helpers')(app);
});

function template(app){
    // let express know where to find the template files
    app.set('views', __dirname + '/views');
    // tell express to use Jade as our template engine
    app.set('view engine', 'jade');
}

function auth(app){
    // @TODO add authentication middleware
}

function xPoweredBy(app,who){
    // replace the 'X-Powered-By' header that express uses anad replace it with our own
    app.use(function (req, res, next) {
        res.header("X-Powered-By",who); // override the 'X-Powered-By: Express' header
        next();
    });
}

function browserify(app){
    var bundle = require('browserify')( __dirname + '/../client/main.js',{
        debug : false
        //, require : { jquery : 'jquery-browserify' } // required because some modules use require('jquery')
        , watch : app.set('env') === 'development' ? { internval : 100 } : null 
        , mount : '/js/main.js'
    });
    log.debug('done setting up bundle');
    bundle.use(require("browserijade")(__dirname + '/../client/templates'));
    app.use(bundle);
}

function less(app){
    // compile less and on every request during development
    app.use(require('connect-less')({ 
        src: __dirname + '/views'
        , dst : __dirname + '/../public'
        , compress : app.set('production') // compress if we're in production env
        , force : app.set('development')
    }));
}

// Log requests
function logging(app){
    if(app.set('env')==='development'){
        app.use(function(req,res,next){
            // show requests in dev mode only
            var opts;
            if(req.auth && req.auth.user) opts = {username: req.auth.user.username};
            else opts = {};
            log.info(('REQUEST: '+req.method+' url: '+req.url),opts);
            next();
        });
    }
}

function errorHandling(app){
    if(app.set('env')==='production') 
        app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
    else if(app.set('env')==='development') 
        app.use(express.errorHandler({ dumpExceptions: true}));
}
