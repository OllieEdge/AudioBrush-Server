var express = require('express'),
    http = require('http'),
    path = require('path'),
    swig = require('swig'),
    cons = require('consolidate'),
    fs = require('fs')

var app = express();

//var expressLogFile = fs.createWriteStream('./logs/express.log', {flags: 'a'});

// all environments
app.set('port', process.env.PORT || 3000);

swig.cache = {};
swig.init({
    root: 'public/views',
    allowErrors: true,
    cache: false,
    filters: {}
});

app.engine('.html', cons.swig);
app.set('views', './public/views');
app.set('view engine', 'html');
app.set('view options', {layout: false});
app.set('view cache', false);

//app.use(express.logger({stream: expressLogFile}));
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

//  --- DB ---
var db = require('./db');

// ---- ROUTER ---
var router = require('./router/AppRouter')(app);
//router.setup(app);

app.set('Router', router);

module.exports = app;