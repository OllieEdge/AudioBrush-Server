var app = require('../../server/server.js');
var request = require('supertest');
var asset = require('assert');

//  CREATE TRACK
//  -----------------------
describe(' PUT /track ', function () {

    it(' returns track() ', function (done) {

        request(app)
            .put('/api/v1/track/abcd-abcd')
            .send({ artist: "abcd-abcd" })
            .expect('Content-Type', /json/)
            .expect(200, done)

    })

})

//  GET TRACK
//  -----------------------
describe(' GET /track ', function () {

    it(' returns track() ', function (done) {

        request(app)
            .get('/api/v1/track/abcd-abcd')
            .expect('Content-Type', /json/)
            .expect(200, done)

    })

})


//  GET TRACKS
//  -----------------------
describe(' GET /tracks ', function () {

    it(' returns tracklist [] ', function (done) {

        request(app)
            .get('/api/v1/tracks')
            .expect('Content-Type', /json/)
            .expect(200, done)

    })

})