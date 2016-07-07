var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var express = require('express');
var app = express();

app.post('/login', function (request, response) {
  response.json({
    "status": "ok",
    "token": "HD3YN4C2GGU89CLKROTUNHVGGDU8G4"
  }),




app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
