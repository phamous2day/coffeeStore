var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(bodyParser.json());


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




app.get('/options', function(request, response) {
  // sends a json response in the message body
  response.json(coffeeChoices);
});









app.post('/', function(request, response) {
  // reads in json format data from the request body
  var name = request.body.name;
  response.json(coffeeChoices);
});




app.listen(3000, function() {
  console.log('Listening on port 3000.');
});
