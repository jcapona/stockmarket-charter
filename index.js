var express = require('express');  
var app = express();  
var server = require('http').Server(app);  
var io = require('socket.io')(server);
var mongoose = require("mongoose");

require('dotenv').config();
mongoose.connect(process.env.MONGO_URI);

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + 'views'));

app.set('port', (process.env.PORT || 5000));

app.get('/', function(req, res) {  
  res.sendFile(__dirname+'/views/index.html');
});

var StockController = require('./controllers/StockController');
io.on('connection', StockController.getData);

server.listen(app.get('port'));