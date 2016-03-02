var express = require('express');  
var app = express();  
var server = require('http').Server(app);  
var io = require('socket.io')(server);
var bodyParser = require('body-parser');
var mongoose = require("mongoose");

require('dotenv').config();
mongoose.connect(process.env.MONGO_URI);

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + 'views'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function(req, res) {  
  res.sendFile(__dirname+'/views/index.html');
});

var StockController = require('./controllers/StockController');
io.on('connection', StockController.getData);

server.listen(8080, function() {  
  console.log("Server listening on port 8080");
});