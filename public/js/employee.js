var applicants = [];
var employees = [];
var employee_color = {};

var init = function() {
  alert.init('alert_modal');

  $.post('/employee/get_info', {
    branch_code: 'UOS001'
  }, function(data) {
    console.log(data);
    $('.loading_bg').hide();

    if (data.result) {
      applicants = data.applicant;
      employees = data.employee;

      make_applicant_table();
      make_employee_table();
      make_time_table();
    }
  });
};

var make_applicant_table = function() {
  var applicant_table = $('#applicant_table');
  var table_body = applicant_table.find('tbody');

  for (var i = 0; i < applicants.length; i++) {
    var applicant_date = applicants[i].APPLICANT_DATE;
    var parsed_date = applicant_date.slice(0, 4) + '.' + applicant_date.slice(4, 6) + '.' + applicant_date.slice(6, 8);
    var id_card = applicants[i].APPLICANT_ID_CARD == 'y' ? '제출' : '미제출';
    var resume = applicants[i].APPLICANT_RESUME == 'y' ? '제출' : '미제출';
    var template = [
      '<tr data-code="' + applicants[i].APPLICANT_CODE + '" data-name="' + applicants[i].APPLICANT_NAME + '">' +
        '<td>' + applicants[i].APPLICANT_NAME + '</td>' +
        '<td>' + id_card + '</td>' +
        '<td>' + resume + '</td>' +
        '<td>' + parsed_date + '</td>' +
        '<td><div class="button-group">' +
          '<button class="btn btn-primary accept">고용</button>' +
          '<button class="btn btn-danger reject">삭제</button>' +
        '</div></td>' +
      '</tr>'
    ].join('');

    table_body.append(template);
  }
};

var make_employee_table = function() {
  var employee_table = $('#employee_table');
  var table_body = employee_table.find('tbody');

  for (var i = 0; i < employees.length; i++) {
    var employee_date = employees[i].WORK_START_DATE;
    var parsed_date = employee_date.slice(0, 4) + '.' + employee_date.slice(4, 6) + '.' + employee_date.slice(6, 8);
    var rank = employees[i].EMPLOYEE_RANK == 'master' ? '지점장' : '직원';
    var template = [
      '<tr data-code="' + employees[i].EMPLOYEE_CODE + '" data-name="' + employees[i].EMPLOYEE_NAME + '">' +
        '<td>' + employees[i].EMPLOYEE_NAME + '</td>' +
        '<td>' + rank + '</td>' +
        '<td>' + employees[i].EMPLOYEE_SALARY + '</td>' +
        '<td>' + parsed_date + '</td>' +
        '<td><div class="button-group">' +
          '<button class="btn btn-danger reject">해고</button>' +
        '</div></td>' +
      '</tr>'
    ].join('');

    if (rank == '지점장') {
      table_body.prepend(template);
    } else {
      table_body.append(template);
    }
  }
};

var color_list = ['#3c8dbc', '#f39c12', '#00a65a', '#00c0ef', '#d2d6de', '#39CCCC', '#605ca8', '#ff851b', '#D81B60', '#111111', '#001F3F'];
var week_date = {
  mon: '12-06-2017',
  tue: '13-06-2017',
  wed: '14-06-2017',
  thu: '15-06-2017',
  fri: '16-06-2017',
  sat: '17-06-2017',
  sun: '18-06-2017'
};

var make_time_table_data = function(callback) {
  var data = [];
  // mon:14~22,wed:14~22,fri:14~22
  for (var i = 0; i < employees.length; i++) {
    var part = employees[i].WORK_TIME.split(',');
    for (var j = 0; j < part.length; j++) {
      var day = part[j].split(':')[0];
      var time = part[j].split(':')[1];

      data.push({
        id : employees[i].EMPLOYEE_CODE,
        title : employees[i].EMPLOYEE_NAME,
        start : week_date[day] + ' ' + time.split('~')[0] + ':00',
        end : week_date[day] + ' ' + time.split('~')[1] + ':00',
        backgroundColor: color_list[i%color_list.length],
        textColor : '#FFF'
      });
    }
  }

  callback(data);
};




var make_time_table = function() {
  var time_table = $('#time_table');

  make_time_table_data(function(table_data) {
    time_table.easycal({
      columnDateFormat : 'dddd',
      timeFormat : 'HH:mm',
      minTime : '00:00',
      maxTime : '24:00',
      slotDuration : 60, //in mins
      startDate: '12-06-2017',
      dayClick : null,
      eventClick : null,
      events : table_data,

      widgetHeaderClass : 'ec-day-header',
      widgetSlotClass : 'ec-slot',
      widgetTimeClass : 'ec-time'
    });
  });
};

var make_employee_color = function() {
  for (var i = 0; i < employees.length; i++) {
    employee_color[employees[i].EMPLOYEE_CODE]
  }
};

$('#employee_table_search').on('keyup', function() {
  var code = $(this).val();
  var employee_table = $('#employee_table');
  var table_body = employee_table.find('tbody');
  var rows = table_body.find('tr');

  if (code) {
    for (var i = 0; i < rows.length; i++) {
      if (rows.eq(i).attr('data-name').indexOf(code) > -1) {
        rows.eq(i).show();
      } else {
        rows.eq(i).hide();
      }
    }
  } else {
    rows.show();
  }
});

$('#applicant_table_search').on('keyup', function() {
  var code = $(this).val();
  var applicant_table = $('#applicant_table');
  var table_body = applicant_table.find('tbody');
  var rows = table_body.find('tr');

  if (code) {
    for (var i = 0; i < rows.length; i++) {
      if (rows.eq(i).attr('data-name').indexOf(code) > -1) {
        rows.eq(i).show();
      } else {
        rows.eq(i).hide();
      }
    }
  } else {
    rows.show();
  }
});
