var Stock = require('../models/Stock.js');

  // Finds a Stock in the db
  exports.readOne = function (req, res) {
    var url = "https://www.quandl.com/api/v3/datasets/WIKI/"+req.params.id+".json?";
    var start_date = "start_date=1985-05-01";
    var end_date = "end_date=1997-07-01";
    var order = "order=asc";
    var column_index = "column_index=4";
    var collapse= "collapse=quarterly";
    var transf = "transformation=rdiff";

    var query = url+"&"+start_date+"&"+end_date+"&"+order+"&"+column_index+"&"+collapse+"&"+transf;

  };

};