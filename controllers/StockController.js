var Stock = require('../models/Stock.js');
var Quandl = require("quandl");
var quandl = new Quandl({
  auth_token: process.env.QUANDL_KEY
});

// Parameter to request data to Quandl API
var options = {
  format: 'json',
  start_date: "2016-01-01",
  end_date: "2016-02-29",
  column_index: 4,
  order: "asc"
};
var search = { source:'WIKI', table: ''};

// Finds a Stock in the db
exports.readOne = function (req, res) {
  search.table = req.params.id;
  quandl.dataset(search, options, function(err, response){
    if(err)
      console.err(err);

    response = JSON.parse(response);

    if(response['dataset'] !== undefined)
    {
      var dat = response.dataset;
      
      Stock.StockModel.findOne({_id: dat.id}, function(err, stock) {
        if(err)
          return res.status(500).send(err.message);
        if(stock)
          return res.json(stock);

        var date=[], vals=[];
        dat.data.forEach(function(val, index){
          date.push(val[0]);
          vals.push(val[1]);
          
          if(index + 1 === dat.data.length)
          {
            var stock = new Stock.StockModel({
              _id: dat.id,
              name: dat.dataset_code,
              dates: date,
              values: vals
            }).save(function(err,stock) {
              if(err) 
                return res.status(500).send(err.message);        
              res.json(stock);
              /*
              TODO: Call function to send DB elements to each user
              */
            })
          }
        });
      });
    }
    else
    { 
      var obj = {}
      if(response['quandl_error'] !== undefined)
        obj.err = response['quandl_error'];
      else
        obj.err = response;
      res.json(obj);
    }
  });
};

exports.getData = function (ws, req) {
  Stock.StockModel.find({}, function(err, stocks){
    ws.send(JSON.stringify({stocks: stocks}), function (error){
      if(error)
        console.error(error);
    });
  })
  
}