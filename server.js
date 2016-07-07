var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var User = require('./user');
var bcrypt = require('bcrypt');
var randtoken = require('rand-token');
var AuthToken = require('./AuthToken')

app.use(bodyParser.json());
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/coffee');



var saltRounds = 10;







app.get('/options', function(request, response) {
  // sends a json response in the message body
  var coffeeChoices =
  [
    "Extra coarse",
    "Coarse",
    "Medium-coarse",
    "Medium",
    "Medium-fine",
    "Fine",
    "Extra fine"
  ];
  response.json(coffeeChoices);
});






app.post('/signup', function(request, response) {
  // reads in json format data from the request body
  var name = request.body.username;
  var password = request.body.password;
  console.log(request.body);
  console.log(password);
  console.log(saltRounds);
  //response.json(coffeeChoices);
  bcrypt.hash(password, saltRounds, function(err, encryptedPassword) {
    if (err) {
      console.error("This is coming from bcrypt", err.message);
      return;
    }
    // console.log('Password:', password);
    // console.log('Encrypted password:', encryptedPassword);
    User.create({
      "_id": name,
      "encryptedPassword": encryptedPassword

    }, function(err, user){
      if (err) {
        console.log(err.message);
        console.log(err.errors);
        response.status(409).json({
          status: 'fail',
          message: 'Username is taken'
        });
        return;
      }
      response.json({status: 'ok'});
    });
  });
});






app.post('/login', function(request, response) {
  var username = request.body.username;
  var password = request.body.password;

  User.findOne({
    '_id': username
  }, function (err, user) {
    if (err) {
      response.json({
        "status": "fail",
        "message": "Invalid username or password"
      });
      return handleError(err);
    }

    // response.redirect('/signup'); don't use redirects

    bcrypt.compare(password, user.encryptedPassword, function(err, matched) {
      if (err) {
        console.error("Something is wrong with bcrypt ",err.message);
        return;
      }
      if (matched) {
        console.log('You are logged in!');
        var token = randtoken.generate(64);
        user.authenticationTokens.push(token);
        user.save(function(err) {
          if (err) {
            response.status(400).send({ "status": "fail", "message": "Error saving token: " + err.message });
            return;
          }
          response.json({
            "status": "ok",
            "token": token
          });
        });
      }
    });
  });
});







app.post('/orders', function(request, response) {
  var info = request.body;
  var token = info.authenticationTokens;

  User.findOne({
    authenticationTokens: token
  }, function (err, user) {
    if (!user) {
      response.json({
        "status": "fail",
        "message": "Users not authorized."
      });
      return;
    }
    console.log(info.orders);

    user.orders.push(info.orders);
    console.log(user);
    user.save(function(err){
      if (err) {
        console.log(err.errors);
        var validationErrors = [];
        for (var key in err.errors) {
          validationErrors.push(err.errors[key.message]);

        }
        response.json({
          status: "fail",
          message: "Order Failed. " + err.message + ". " + validationErrors.join(' ')
        });
        return;
      }
      response.json({
        status: 'ok'
      });
    });
  });
});


app.get('/orders?token=', function(request, response) {
  var info = request.body;
  var token = info.authenticationTokens;
  User.findOne({
    authenticationTokens: token
  }, function (err, user) {
    if (!user) {
      response.json({
        "status": "fail",
        "message": "Users not authorized."
      });
      return;
    }
    response.json({
      "orders": orders
    });
  });
});



  app.listen(3000, function() {
    console.log('Listening on port 3000.');
  });
