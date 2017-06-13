
var init = function() {
  $.get('/customer/lookup/all', {}, function(data) {
    if (data.result) {
      parse_customer_data(data.data, function(result) {
        init_customer_chart(result);
      });
    } else {
      console.log('Fail!');
    }

    $.post('/sales/lookup', {}, function(data) {
      if (data.result) {
        parse_sale_data(data.data, function(result) {
          init_sale_chart(result);
        });
      } else {
        console.log('Fail!!!');
      }
    });
  });
};

var parse_customer_data = function(data, callback) {
  var age_spread = {};
  var sex_spread = {
    'F': 0,
    'M': 0
  };

  for (var i = 0; i < data.length; i++) {
    var age = parseInt(data[i].CUSTOMER_AGE/10);
    var sex = data[i].CUSTOMER_SEX;
    if (age_spread[age]) {
      age_spread[age]++;
    } else {
      age_spread[age] = 1;
    }
    sex_spread[sex]++;
  }

  callback({
    age_data: age_spread,
    sex_data: sex_spread
  });
};

var init_customer_chart = function(data) {
  var age_data = data.age_data;
  var sex_data = data.sex_data;

  var customer_chart_canvas = $("#customer_chart").get(0).getContext("2d");
  var customer_chart = new Chart(customer_chart_canvas);
  var customer_data = [];

  var color_list = {
    '1': "#3c8dbc",
    '2': "#00c0ef",
    '3': "#f39c12",
    '4': "#00a65a",
    '5': "#f56954",
    '6': "#d2d6de"
  };
  var color_class = {
    '1': "text-light-blue",
    '2': "text-aqua",
    '3': "text-yellow",
    '4': "text-green",
    '5': "text-red",
    '6': "text-gray"
  }

  var template = ['<ul class="chart-legend clearfix">'];

  for (var i in age_data) {
    var label = i*10 + '대';
    template.push('<li><i class="fa fa-circle-o ' + color_class[i] + '"></i> ' + label + '</li>');
    customer_data.push({
      value: age_data[i],
      color: color_list[i],
      highlight: color_list[i],
      label: label
    });
  }
  template.push('</ul>');

  template.join('');

  var pie_options = {
    //Boolean - Whether we should show a stroke on each segment
    segmentShowStroke: true,
    //String - The colour of each segment stroke
    segmentStrokeColor: "#fff",
    //Number - The width of each segment stroke
    segmentStrokeWidth: 2,
    //Number - The percentage of the chart that we cut out of the middle
    percentageInnerCutout: 50, // This is 0 for Pie charts
    //Number - Amount of animation steps
    animationSteps: 100,
    //String - Animation easing effect
    animationEasing: "easeOutBounce",
    //Boolean - Whether we animate the rotation of the Doughnut
    animateRotate: true,
    //Boolean - Whether we animate scaling the Doughnut from the centre
    animateScale: false,
    //Boolean - whether to make the chart responsive to window resizing
    responsive: true,
    // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    maintainAspectRatio: true,
    //String - A legend template
    legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<segments.length; i++){%><li><span style=\"background-color:<%=segments[i].fillColor%>\"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>"
  };
  //Create pie or douhnut chart
  // You can switch between pie and douhnut using the method below.
  customer_chart.Doughnut(customer_data, pie_options);

  var sex_info = [{
    value: sex_data['M'],
    color: "#00c0ef",
    highlight: "#00c0ef",
    label: '남성'
  }, {
    value: sex_data['F'],
    color: "#f56954",
    highlight: "#f56954",
    label: '여성'
  }];

  var customer_sex_chart_canvas = $("#customer_sex_chart").get(0).getContext("2d");
  var customer_sex_chart = new Chart(customer_sex_chart_canvas);
  customer_sex_chart.Doughnut(sex_info, pie_options);

  $('#customer_info').append(template);
  var _template = [
    '<ul class="chart-legend clearfix">',
    '<li><i class="fa fa-circle-o text-aqua"></i> ' + '남성' + '</li>',
    '<li><i class="fa fa-circle-o text-red"></i> ' + '여성' + '</li>',
    '</ul>'
  ].join('');
  $('#customer_sex_info').append(_template);
};

var parse_sale_data = function(data, callback) {
  var month_data = {};

  for(var i = 0; i < data.length; i++) {
    var date = data[i].SELLING_DATE.toString().slice(0, 6);
    var price = data[i].SELLING_PRICE;

    if (month_data[date]) {
      month_data[date]+=parseInt(price);
    } else {
      month_data[date] = parseInt(price);
    }
  }

  callback(month_data);
};

var init_sale_chart = function(data) {
  var label = [];
  var chart_data = [];

  for (var i in data) {
    label.push(i.slice(0, 4) + '.' + i.slice(4, 6));
    chart_data.push(data[i]);
  }

  var areaChartData = {
    labels: label,
    datasets: [
      {
        label: "매출 현황",
        fillColor: "rgba(60,141,188,0.9)",
        strokeColor: "rgba(60,141,188,0.8)",
        pointColor: "#3b8bba",
        pointStrokeColor: "rgba(60,141,188,1)",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(60,141,188,1)",
        data: chart_data
      }
    ]
  };

  var areaChartOptions = {
    //Boolean - If we should show the scale at all
    showScale: true,
    //Boolean - Whether grid lines are shown across the chart
    scaleShowGridLines: true,
    //String - Colour of the grid lines
    scaleGridLineColor: "rgba(0,0,0,.05)",
    //Number - Width of the grid lines
    scaleGridLineWidth: 1,
    //Boolean - Whether to show horizontal lines (except X axis)
    scaleShowHorizontalLines: true,
    //Boolean - Whether to show vertical lines (except Y axis)
    scaleShowVerticalLines: true,
    //Boolean - Whether the line is curved between points
    bezierCurve: false,
    //Number - Tension of the bezier curve between points
    bezierCurveTension: 0.3,
    //Boolean - Whether to show a dot for each point
    pointDot: true,
    //Number - Radius of each point dot in pixels
    pointDotRadius: 4,
    //Number - Pixel width of point dot stroke
    pointDotStrokeWidth: 1,
    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
    pointHitDetectionRadius: 20,
    //Boolean - Whether to show a stroke for datasets
    datasetStroke: true,
    //Number - Pixel width of dataset stroke
    datasetStrokeWidth: 2,
    //Boolean - Whether to fill the dataset with a color
    datasetFill: true,
    //String - A legend template
    legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
    //Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    maintainAspectRatio: true,
    //Boolean - whether to make the chart responsive to window resizing
    responsive: true
  };

  var lineChartCanvas = $("#lineChart").get(0).getContext("2d");
  var lineChart = new Chart(lineChartCanvas);
  var lineChartOptions = areaChartOptions;
  lineChartOptions.datasetFill = false;
  lineChart.Line(areaChartData, lineChartOptions);
};

var init_chart = function() {
  var areaChartData = {
    labels: ["January", "February", "March", "April", "May", "June", "July"],
    datasets: [
      {
        label: "Electronics",
        fillColor: "rgba(210, 214, 222, 1)",
        strokeColor: "rgba(210, 214, 222, 1)",
        pointColor: "rgba(210, 214, 222, 1)",
        pointStrokeColor: "#c1c7d1",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(220,220,220,1)",
        data: [65, 59, 80, 81, 56, 55, 40]
      },
      {
        label: "Digital Goods",
        fillColor: "rgba(60,141,188,0.9)",
        strokeColor: "rgba(60,141,188,0.8)",
        pointColor: "#3b8bba",
        pointStrokeColor: "rgba(60,141,188,1)",
        pointHighlightFill: "#fff",
        pointHighlightStroke: "rgba(60,141,188,1)",
        data: [28, 48, 40, 19, 86, 27, 90]
      }
    ]
  };

  var areaChartOptions = {
    //Boolean - If we should show the scale at all
    showScale: true,
    //Boolean - Whether grid lines are shown across the chart
    scaleShowGridLines: true,
    //String - Colour of the grid lines
    scaleGridLineColor: "rgba(0,0,0,.05)",
    //Number - Width of the grid lines
    scaleGridLineWidth: 1,
    //Boolean - Whether to show horizontal lines (except X axis)
    scaleShowHorizontalLines: true,
    //Boolean - Whether to show vertical lines (except Y axis)
    scaleShowVerticalLines: true,
    //Boolean - Whether the line is curved between points
    bezierCurve: false,
    //Number - Tension of the bezier curve between points
    bezierCurveTension: 0.3,
    //Boolean - Whether to show a dot for each point
    pointDot: true,
    //Number - Radius of each point dot in pixels
    pointDotRadius: 4,
    //Number - Pixel width of point dot stroke
    pointDotStrokeWidth: 1,
    //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
    pointHitDetectionRadius: 20,
    //Boolean - Whether to show a stroke for datasets
    datasetStroke: true,
    //Number - Pixel width of dataset stroke
    datasetStrokeWidth: 2,
    //Boolean - Whether to fill the dataset with a color
    datasetFill: true,
    //String - A legend template
    legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].lineColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",
    //Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    maintainAspectRatio: true,
    //Boolean - whether to make the chart responsive to window resizing
    responsive: true
  };

  var lineChartCanvas = $("#lineChart").get(0).getContext("2d");
  var lineChart = new Chart(lineChartCanvas);
  var lineChartOptions = areaChartOptions;
  lineChartOptions.datasetFill = false;
  lineChart.Line(areaChartData, lineChartOptions);
};
