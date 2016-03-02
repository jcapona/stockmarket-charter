var io = require('../index').io;
var Stock = require('../models/Stock.js');
var Quandl = require("quandl");
var quandl = new Quandl({
  auth_token: process.env.QUANDL_KEY
});

// Parameter to request data to Quandl API
var options = {
  format: 'json',
  //start_date: "2016-01-01",
  end_date: "",
  column_index: 4,
  order: "asc"
};
var search = { source:'WIKI', table: ''};

exports.getData = function (socket) {
  Stock.StockModel.find({}, function(err, stocks){
    if(err)
      console.error(err);
    else
    {  
      socket.emit('data', stocks);
    }
  });

  // Receives a query for displaying a new stock
  socket.on('stock', function(data) {
    search.table = data;
    var today = new Date();
    options.end_date = today.toISOString().slice(0,10);

    quandl.dataset(search, options, function(err, response){
      if(err)
        console.err(err);
      else
      {
        response = JSON.parse(response);

        if(response['dataset'] !== undefined)
        {
          var dat = response.dataset;
          
          Stock.StockModel.findOne({_id: dat.id}, function(err, stock) {
            if(err)
              console.error(err);
            else
            {
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
                      console.error(err);
                    else
                    {
                      Stock.StockModel.find({}, function(err, stocks){
                        if(err)
                          console.error(err);
                        else  
                          io.emit('data', stocks);
                      });
                    }
                  })
                }
              });
            }
          });
        }
        else
        {
          var obj = {}
          if(response['quandl_error'] !== undefined)
            obj.err = response['quandl_error'];
          else
            obj.err = response;
          socket.emit('err', obj);
        }
      }
    });
  });

  socket.on('stock-delete', function(data) {
    Stock.StockModel.findOne({_id: data}, function(err, stock) {
      if(err)
        console.error(err);
      else
      {
        stock.remove(function(err){
          Stock.StockModel.find({}, function(err, stocks){
            if(err)
              console.error(err);
            else  
              io.emit('data', stocks);
          });
        });
      }
    });
  });

  

};