var plottingData = [];

var socket = io.connect($(location).attr('href'), { 'forceNew': true });

socket.on('err', function(data) {  
  $("#err").html("<p>"+data.err.message+"</p>");
});

socket.on('data', function(data) {  
  $("#err").html('');
  // TODO: Implement compare function to avoid replot
  if(data != plottingData)
  {
    deletePlot(plottingData, function(err){
      if(err) return;
      plottingData = data;
      plot(plottingData, function(err){
        if(err) return;

        $("#stocks-span").html('');
        plottingData.forEach(function(val,index){
          var btnCode = "<a class='btn btn-default stocks-btn'>"+val.name+" <span>&times;</span></a>";
          $("#stocks-span").append(btnCode);
        });

      });
    });
  }
  
})

draw(); // Initialize drawing

$("#stock-input").on('submit',function(e){
  e.preventDefault();
  var val = $('#stock-name').val();
  socket.emit('stock', val);
})

function plot(data, callback)
{
  if(data.length == 0)
    return callback(false);
 
  data.forEach(function(val,index){
    var plotData = [
      {
        x: val.dates,
        y: val.values,
        name: val.name,
        type: 'scatter'
      }
    ];

    Plotly.addTraces('stockChart', plotData);
    if(index+1 == data.length)
      return callback(false);
  });
}

function deletePlot(data, callback)
{
  if(data.length == 0)
    return callback(false);

  data.forEach(function (val, index){
    Plotly.deleteTraces('stockChart', 0);
    if(index + 1 == data.length)
      return callback(false);
  })
}

function deleteSinglePlot(index, callback)
{
  Plotly.deleteTraces('stockChart', index);
  return callback();
}

function draw(){
  var layout = {
    title: '',
    xaxis: {
      title: 'Date',
      showgrid: false,
      zeroline: false
    },
    yaxis: {
      title: 'Close USD',
      showline: false
    }
  };

  Plotly.newPlot('stockChart', [], layout);
}