var app = require('../../server/server.js');
var request = require('supertest');
var asset = require('assert');


var USER_NAME = 'this-is-a-test-user';

//  CREATE USER
//  -----------------------
describe(' PUT /user ', function () {

    it(' return user() ', function (done) {

        request(app)
            .put('/api/v1/user/' + USER_NAME)
            .expect('Content-Type', /json/)
            .expect(200, done)

    })

    it(' return 401 ', function (done) {

        request(app)
            .put('/api/v1/user/' + USER_NAME)
            .expect('Content-Type', /json/)
            .expect(401, done)
    })

})


//  UPDATE USER
//  -----------------------
describe(' POST /user ', function () {

    it(' return 200 ', function (done) {

        request(app)
            .post('/api/v1/user/' + USER_NAME)
            .expect('Content-Type', /json/)
            .expect(200, done)
    })

})


//  GET USER
//  -----------------------
describe(' GET /user ', function () {

    it(' return 200 ', function (done) {

        request(app)
            .get('/api/v1/user/' + USER_NAME)
            .expect('Content-Type', /json/)
            .expect(200, done)
    })

})

//  GET USER
//  -----------------------
describe(' GET /users ', function () {

    it(' return 200 ', function (done) {

        request(app)
            .get('/api/v1/users/')
            .expect('Content-Type', /json/)
            .expect(200, done)
    })

})


//  DELETE USER
//  -----------------------
describe('DELETE /user', function () {

    it(' return 200 ', function (done) {

        request(app)
            .del('/api/v1/user/' + USER_NAME)
            .expect('Content-Type', /json/)
            .expect('Content-Length', '2')
            .expect(200, done)
    })

})








