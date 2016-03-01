var express = require('express');
var bodyParser = require('body-parser');
var app = express();

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Routes 
app.get('/', function (req, res) {
  res.sendFile(__dirname+'/views/index.html');
});

// CRUD operations
var StockController = require('./controllers/StockController');
app.get('/data/:id',StockController.readOne); // Read One


app.get('/*', function (req, res) {
  res.redirect('/');
});

app.listen(process.env.PORT || 5000);