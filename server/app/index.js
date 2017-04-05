'use strict';

var app = require('express')();
var path = require('path');
var session = require('express-session');
var User = require('../api/users/user.model');

// "Enhancing" middleware (does not send response, server-side effects only)

// sessions setup
// this middleware checks each request for a cookie with session id in header. it tries to find a session in its store that matches. if a session exists it will attach it to the res header and the session id (a hashed version) will go back and forth via cookies at each request, until the session is destroyed. if no session exists it will create a new cookie with session id and send that in res header.
app.use(session({
  // this mandatory configuration ensures that session IDs are not predictable
  secret: 'secretsarecool', // or whatever you like
  // these options are recommended and reduce session concurrency issues
  resave: false,
  saveUninitialized: false
}));

// log sessions at each http request
app.use(function (req, res, next) {
  console.log('session', req.session);
  next();
});

app.use(require('./logging.middleware'));

app.use(require('./body-parsing.middleware'));

// login post request
app.post('/login', function(req, res, next) {
  User.findOne({
    where: {
      email: req.body.email,
      password: req.body.password
    }
  })
  .then(function(user) {
    if (!user) {
      res.status(401).send("Error");
    }
    else {
      req.session.userId = user.id;
      res.status(200).send(user);
    }
  })
  .catch(next)
})

//logout post request:

app.post('/logout', function(req, res, next) {
  req.session.destroy()
  res.sendStatus(200);
})

// "Responding" middleware (may send a response back to client)

app.use('/api', require('../api/api.router'));

var validFrontendRoutes = ['/', '/stories', '/users', '/stories/:id', '/users/:id', '/signup', '/login'];
var indexPath = path.join(__dirname, '..', '..', 'browser', 'index.html');
validFrontendRoutes.forEach(function (stateRoute) {
  app.get(stateRoute, function (req, res) {
    res.sendFile(indexPath);
  });
});

app.use(require('./statics.middleware'));

app.use(require('./error.middleware'));


module.exports = app;
