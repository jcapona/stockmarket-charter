var mongoose = require('mongoose');

var StockSchema = new mongoose.Schema({
  _id: String,
  name: String,
  dates: [String],
  values: [String]
});

var Stock = mongoose.model("stocks", StockSchema);

module.exports = {StockModel: Stock};