var app = require('../server/server.js');
var request = require('supertest');
var asset = require('assert');


describe('The api should contain a route for all users', function () {
    it('should return a colleciton of users', function (done) {
        request(app)
            .get('/api/v1/users/')
            .expect(200).end(function(err){
                if(err){console.log('--- ERROR ---', err)}
                else{done()};
            })

    })
})


