var mongoose = require('mongoose');

var StockSchema = new mongoose.Schema({
  name: String,
  date: String,
  value: String
});

module.exports = {Stock: StockSchema};