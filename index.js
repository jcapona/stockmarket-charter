var express = require('express');
var bodyParser = require('body-parser');
var app = express();
var expressWs = require('express-ws')(app);
var mongoose = require("mongoose");

require('dotenv').config();
mongoose.connect(process.env.MONGO_URI);

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + 'views'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  res.sendFile(__dirname+'/views/index.html');
});

// CRUD operations
var StockController = require('./controllers/StockController');
app.get('/data/:id',StockController.readOne); // Read One
expressWs.getWss().on('connection', StockController.getData);

app.get('/*', function (req, res) {
  res.redirect('/');
});

app.listen(process.env.PORT || 5000);