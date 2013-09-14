/*
 -------------------------------------
 TODOS: ->
 1.  SIMPLIFY REQUESTS TO ALL USE BODY
 2.  BUILD ROUTE MIDDLEWARE TO PROVIDE A REQ.DATA OBJECT
 3.  IMPLEMENT NEW REQ.DATA MODEL IN ALL COMPONENTS

 4.  IMPLEMENT BASE ROUTE CONTROLLER || SHARED DB METHOD HELPERS
 5.  MODEL WIDE VALIDATION

 6.  PROPER APPLICATION ERROR HANDLING

 7.  REDIS CACHE MONGOOSE LAYER (https://github.com/conancat/mongoose-redis-cache)

 8.  CHEF PROVISIONED VAGRANT BOX
 9.  PUBLIC/PRIVATE GITBUCKET/GIT REPO BRAH

 10. CLOUD HOSTING OPTIONS

 -------------------------------------
 */

require("node-codein")

var http = require('http');
var app = require('./server/server.js');

//  --- SERVER ---
http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
