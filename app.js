var express = require('express'),
  http = require('http'),
  path = require('path'),
  swig = require('swig'),
  cons = require('consolidate');

var app = express();


// all environments
app.set('port', process.env.PORT || 3000);

swig.cache = {};
swig.init({
    root       : 'public/views',
    allowErrors: true,
    cache      : false,
    filters    : {}
});

app.engine('.html', cons.swig);
app.set('views', './public/views');
app.set('view engine', 'html');
app.set('view options', {layout: false});
app.set('view cache', false);

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

app.get('/', function (req, res) {
    res.render('index.twig.html')
});


app.get('/user', function (data) {
//    var User = require('./server/user')
//    var u = new User(data)
//    u.save()
});

var db = require('./server/db')

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
