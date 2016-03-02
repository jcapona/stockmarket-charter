var plottingData = [];

var socket = io.connect($(location).attr('href'), { 'forceNew': true });

socket.on('err', function(data) {  
  $("#err").html("<div class='alert alert-danger alert-dismissible' role='alert'><button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button><strong>"+data.err.message+"</strong></div>");
  $("#stock-name").addClass("has-error");
});

socket.on('data', function(data) { 
  $("#err").html('');
  $("#stock-name").removeClass("has-error");
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
          var btnCode = "<div class='col-xs-6 col-sm-4 col-md-3'><div class='stock-cont'><h2>"+val.name;
           btnCode += "<button class='btn btn-default stocks-btn close' type='button' value="+val._id+"><span>&times;</span></button></h2>";
           btnCode += "</div></div>";

          $("#stocks-span").append(btnCode);
        });

      });
    });
  }
  
})

/**
  Deletes an stock from graph
*/
$('#stocks').on('click', '.stocks-btn', function (e) {  
  e.preventDefault();
  socket.emit('stock-delete', this.value);
});

draw(); // Initialize drawing

$("#range").on('change', function(){
  var layout = {
    title: '',
    showlegend: false,
    paper_bgcolor: "rgb(42,42,42)",
    plot_bgcolor: "rgb(42,42,42)",
    margin: {
      b: 40,
      l: 70,
      r: 50,
      t: 20
    },
    xaxis: {
      showgrid: false,
      zeroline: false,
      gridcolor: "#eee",
      type: "date",
      tickformat: "%x",
      range: [(new Date).getTime()-Number($("#range").val()), (new Date).getTime()],
      titlefont: {
        family:  'Oswald, sans-serif',
        size: 12,
        color: '#eee'
      },
      tickfont:{
        color: "#eee",
      }
    },
    yaxis: {
      title: 'Closing Price - USD',
      showline: false,
      zeroline: false,
      gridcolor: "#444",
      titlefont: {
        family:  'Oswald, sans-serif',
        size: 15,
        color: '#eee'
      },
      tickfont:{
        color: "#eee",
      }
    },
    legend: {
      font: {
        family:  'Oswald, sans-serif',
        size: 15,
        color: '#eee'
      },
    }
  };

  Plotly.relayout('stockChart', layout)
});

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
    showlegend: false,
    paper_bgcolor: "rgb(42,42,42)",
    plot_bgcolor: "rgb(42,42,42)",
    margin: {
      b: 40,
      l: 70,
      r: 50,
      t: 20
    },
    xaxis: {
      showgrid: false,
      zeroline: false,
      gridcolor: "#eee",
      type: "date",
      tickformat: "%x",
      range: [1456876800000-Number($("#range").val()), 1456876800000],
      titlefont: {
        family:  'Oswald, sans-serif',
        size: 12,
        color: '#eee'
      },
      tickfont:{
        color: "#eee",
      }
    },
    yaxis: {
      title: 'Closing Price - USD',
      showline: false,
      zeroline: false,
      gridcolor: "#444",
      titlefont: {
        family:  'Oswald, sans-serif',
        size: 15,
        color: '#eee'
      },
      tickfont:{
        color: "#eee",
      }
    },
    legend: {
      font: {
        family:  'Oswald, sans-serif',
        size: 15,
        color: '#eee'
      },
    }
  };

  Plotly.newPlot('stockChart', [], layout);
}


window.onresize = function() {
  Plotly.Plots.resize('stockChart');
};