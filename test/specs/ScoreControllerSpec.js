var app = require('../../server/server.js');
var request = require('supertest');
var asset = require('assert');

// before each ?
// --------------------------------
request(app)
    .put('/api/v1/track/abcd-abcd')
    .send({ artist: "abcd-abcd" })
    .expect('Content-Type', /json/)
    .expect(200, function (err) {
        if (err)console.log(err)
        else  console.log('made track')
    })

request(app)
    .put('/api/v1/user/abcd-abcd')
    .send({ artist: "abcd-abcd" })
    .expect('Content-Type', /json/)
    .expect(200, function (err) {
        if (err)console.log(err)
        else  console.log('made user')
    })


//  CREATE SCORE
//  -----------------------
describe(' PUT /score ', function () {

    it(' return score() ', function (done) {

        request(app)
            .put('/api/v1/score/abcd-abcd')
            .send({ username: "abcd-abcd", score: 2500 })
            .expect('Content-Type', /json/)
            .expect(200, done)

    })

})


//  GET SCORES
//  -----------------------
describe(' GET /scores ', function () {

    it(' return scores() ', function (done) {

        request(app)
            .get('/api/v1/scores')
            .send({ username: "abcd-abcd", score: 2500 })
            .expect('Content-Type', /json/)
            .expect(200, done)

    })

})