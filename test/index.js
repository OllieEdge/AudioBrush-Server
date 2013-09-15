var app = require('../server/server.js');
var request = require('supertest');
var asset = require('assert');
var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var Q = require('q');



var dir =  path.resolve(__dirname, './')
recursiveGetFiles(dir).then(function(){
    console.log('complete')
})

function recursiveGetFiles(diretory){

    var defered = Q.defer();

    var files = fs.readdirSync( directory );
    _.map(function(index, el){
        console.log(index, el)
    })

    return defered.promise;
}


//describe('The api should contain a route for all users', function () {
//    it('should return a colleciton of users', function (done) {
//        request(app)
//            .get('/api/v1/users/')
//            .expect(200).end(function(err){
//                if(err){console.log('--- ERROR ---', err)}
//                else{done()};
//            })
//
//    })
//})





