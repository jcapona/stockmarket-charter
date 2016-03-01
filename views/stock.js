
Plotly.newPlot('stockChart', []);

$("#stock-input").on('submit',function(e){
  var val = $('#stock-name').val();
  plot(val);
})

function plot(company)
{
  var query = "https://stockmarket-charter.herokuapp.com/" + company + "/";
  $.getJSON(query, function(data) 
  {
    console.log(data);

    var data = [
      {
        x: data.dates,
        y: data.values,
        name: data.name,
        type: 'scatter'
      }
    ];

    Plotly.addTraces('stockChart', data);
  });
}