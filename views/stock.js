
var socket = io.connect($(location).attr('href'), { 'forceNew': true });

socket.on('err', function(data) {  
  $("#err").html("<p>"+data.err.message+"</p>");
});

socket.on('data', function(data) {  
  console.log(data);
  $("#err").html('');
  data.forEach(function(val,index){
    plot(val);
  })
})

draw(); // Initialize drawing

$("#stock-input").on('submit',function(e){
  e.preventDefault();
  var val = $('#stock-name').val();
  socket.emit('stock', val);
})

function plot(data)
{
  var plotData = [
    {
      x: data.dates,
      y: data.values,
      name: data.name,
      type: 'scatter'
    }
  ];
  Plotly.addTraces('stockChart', plotData);
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