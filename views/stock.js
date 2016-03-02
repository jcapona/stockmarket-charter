draw(); // Initialize drawing

$("#stock-input").on('submit',function(e){
  e.preventDefault();
  var val = $('#stock-name').val();
  connection.send(val);
  getData(val);
})

// Websocket connection

window.WebSocket = window.WebSocket || window.MozWebSocket; // use mozilla built in websocket if possible

var connection = new WebSocket('wss://'+ $(location).attr('host'));

connection.onopen = function () {
};

connection.onerror = function (error) {
};

connection.onmessage = function (message) {
  console.log(message);
  try {
      var msg = JSON.parse(message.data);
  } catch (e) {
      console.log('This doesn\'t look like a valid JSON: ', message.data);
      return;
  }
  console.log(msg);
  msg.stocks.forEach(function(val,index){
    plot(val);
  })

};

// Plotting functions 

function getData(company)
{ 
  var query = $(location).attr('href') + "data/" +company;
  $.getJSON(query, function(data) 
  {
    if(data.err !== undefined)
    {
      $("#err").html("<p>"+data.err.message+"</p>");
    }
    else
    {
      $("#err").html('');
      plot(data);
    }
  });
}

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