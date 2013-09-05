var mongoose = require('mongoose');
var User = mongoose.model('User');

var error = require('../utils/Error');
var sanitise = require('../utils/Sanitise');



module.exports = {
    //  CREATE USER
    //  ------------------------
    createUser: function (req, res) {

        if (req.params.username) {
            var username = sanitise.username(req.params.username)

            // query db for existing player with username
            User
              .find({ role: 'player', username: username })
              .limit(1)
              .exec(function (err, user) {

                  /* TODO ADD ROBUST ERROR HANDELING */
                  if (err) {
                      error(err)
                  }

                  else {
                      console.log(user)
                      if (user.length <= 0) { //check if existing user exists
                          var user = new User(req.params);//make new user
                          user.save(function (err, user) {//save said user
                              console.log('sending', user)
                              res.send(200, user)//on success send user
                          });
                      }
                      else {
                          res.send(401, new Error())//send 401
                      }
                  }
              })
        }
        else {
            error();
        }
    },

    //  READ USER
    //  ------------------------
    readUser  : function (req, res) {

        if (req.params.username) {
            var username = sanitise.username(req.params.username);//sanitise the input

            User
              .find({ role: 'player', username: username })
              .select('role username created updated')
              .exec(function (err, user) {
                  if (err) {
                      error(err);
                  }
                  else {
                      res.send(200, user)
                  }
              })
        }

        else {
            res.send(400, new Error('Please use a resource identifier'))
        }


    },

    //  READ COLLECTION OF USERS
    //  ------------------------
    readUsers : function (req, res) {

        var limit = req.body.limit ? sanitise.limit(req.body.limit) : 10;
        var sort = req.body.sort ? sanitise.sort(req.body.sort) : '-updated';

        User.find({ role: 'player' })
          .limit(limit)
          .sort(sort)
          .select('role username created updated')
          .exec(function (err, users) {
              if (err) {
                  error(err);
              }
              else {
                  res.send(200, users)
              }
          })


    },


    //  UPDATE USER
    //  ------------------------
    updateUser: function (req, res) {
        //check for the route user name /update/user/:username
        var username = req.params.username ? sanitise.username(req.params.username) : null;//sanitise the input

        //check for the change of username
        var newUsername = req.body.username ? sanitise.username(req.body.username) : null;
        var credits = req.body.credits ? sanitise.credits(req.body.credits) : null;

        if (username) {
            User
              .findOne({username: username})
              .select('username created updated credits')
              .lean()
              .exec(function (err, user) {
                  if (err) {
                      error(err, res)
                  }
                  else {
                      user.username = newUsername ? newUsername : user.username;
                      user.credits = credits ? credits : user.credits;
                      user.save(function (err, user) {
                          if (err) {
                              error(err, res);
                          }
                          else {
                              res.send(200, user)
                          }
                      })
                  }
              })


        }
        else {
            error(new Error('no username provided'), res)
        }

    },


    //  DELETE USER
    //  ------------------------
    deleteUser: function (req, res) {
        var username = req.params.username ? sanitise.username(req.params.username) : null;//sanitise the input
        if (username) {
            User.findOne({username: username}).exec(function (err, user) {
                if (err) {
                    error(err, res);
                }
                else if (user) {
                    user.remove()
                    res.send(200, {})
                }
            })
        }
    }
};