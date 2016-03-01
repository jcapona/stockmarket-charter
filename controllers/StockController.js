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
        throw err;
      
      if(JSON.parse(response).dataset.data)
      {
        var dat = JSON.parse(response).dataset;
        
        var date=[], vals=[];
        dat.data.forEach(function(val, index){
          date.push(val[0]);
          vals.push(val[1]);
          
          if(index + 1 === dat.data.length)
          {
            var obj = {};
            obj._id = dat.id;
            obj.name = dat.dataset_code;
            obj.dates = date;
            obj.values = vals;
            //obj.backup = dat;

            res.json(obj);
          }
        });
      }
  });
};
