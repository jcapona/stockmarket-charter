draw();

$("#stock-input").on('submit',function(e){
  var val = $('#stock-name').val();
  plot(val);
})

function plot(company)
{
  var query = "http://localhost:5000/data/"+company;
  $.getJSON(query, function(data) 
  {
    console.log(data);
    if(data.err !== undefined)
    {
      $("#err").html("<p>"+data.err.message+"</p>");
    }
    else
    {
      $("#err").html('');
      var data = [
        {
          x: data.dates,
          y: data.values,
          name: data.name,
          type: 'scatter'
        }
      ];
      Plotly.addTraces('stockChart', data);
    }
  });
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