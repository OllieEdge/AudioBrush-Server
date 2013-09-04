var mongoose = require('mongoose')

mongoose.connection.on('error', function (err) {
    console.log('--------')
    console.log(err)
})

mongoose.connection.on('connecting', function (data) {
    console.log('-------- connecting')
    console.log(data)
})

mongoose.connection.on('connected', function (data) {
    console.log('-------- connected')
    console.log(data)
})


mongoose.connect('localhost', 'audiobrush')



/*
 *
 * mongoose = require 'mongoose'

 mongoose.connection.on 'error' , (err) ->
 console.log arguments , 'error'

 mongoose.connection.on 'connecting' , (err) ->
 console.log arguments , 'connecting'

 mongoose.connection.on 'connected' , (err) ->
 console.log arguments , 'connected'

 mongoose.model 'User' , require './models/User'

 mongoose.connect 'localhost' , 'ibjjrs-api'
 *
 *
 * */