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
   
      res.json(JSON.parse(response));// Must use JSON.parse! 
  });
};
