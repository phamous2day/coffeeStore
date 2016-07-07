var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('Hello World!');
});




mongoose.connect('mongodb://localhost/coffee');
var User = require('./user');

User.create(
  {
    "_id":
      "CAPTAINCRUNCHID",
    "encryptedPassword":
      "myencryptedpassword",

    }
  } , function(err, data){
    console.log(err);
    console.log(data);
  });


  app.listen(3000, function () {
    console.log('Example app listening on port 3000!');
  });
