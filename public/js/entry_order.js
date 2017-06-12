var branch_code = 'UOS001';
var request_list = [];

var init = function() {
  alert.init('alert_modal');

  $.post('/request/get', {
    branch_code: 'UOS001'
  }, function(data) {
    if (data.result) {
      request_list = data.requests;
      console.log(request_list);

      make_request_table();

      $('.loading_bg').hide();
    } else {
      $('.loading_bg').hide();
      alert.show('데이터를 가져오는데 실패하였습니다.');
    }
  });
};

var make_request_table = function() {
  var request_table = $('#request_table');
  var table_body = request_table.find('tbody');

  for (var i = 0; i < request_list.length; i++) {
    var request_date = request_list[i].REQUEST_DATE;
    var parsed_date = request_date.slice(0, 4) + '.' + request_date.slice(4, 6) + '.' + request_date.slice(6, 8);
    var request_code = request_list[i].REQUEST_CODE;
    var template = [
      '<tr data-code="' + request_code + '">' +
        '<td>' + request_code + '</td>' +
        '<td>' + parsed_date + '</td>' +
        '<td><div class="button-group">' +
          '<button class="btn btn-teal request_lookup">상세 정보</button>' +
          '<button class="btn btn-success request_lookup_arrive">입고 조회</button>' +
        '</div></td>' +
      '</tr>'
    ].join('');

    table_body.append(template);
  }
};

$('#request_table').on('click', '.request_lookup', function() {
  var $tr = $(this).parents('tr');
  var code = $tr.attr('data-code');

  $('.loading_bg').show();

  $.post('/request/request_item', {
    code: code
  }, function(data) {
    if (data.result) {
      var request_item_list = data.data;

      make_request_item_table(request_item_list, function() {
        $('.loading_bg').hide();
        $('#request_item_modal').modal('show');
      });
    } else {
      $('.loading_bg').hide();
      alert.show('상세 정보를 가져오는데 실패하였습니다.');
    }
  });
});

var make_request_item_table = function(request_item_list, callback) {
  var request_item_table = $('#request_item_table');
  var table_body = request_item_table.find('tbody');
  table_body.empty();
  var total_price = 0;

  for (var i = 0; i < request_item_list.length; i++) {
    var item = request_item_list[i];

    var template = [
      '<tr>' +
        '<td>' + item.ITEM_CODE + '</td>' +
        '<td>' + item.ITEM_NAME + '</td>' +
        '<td>' + item.ITEM_PRICE + '</td>' +
        '<td>' + item.REQUEST_ITEM_COUNT + '</td>' +
        '<td><i class="fa fa-krw"></i>' + (item.ITEM_PRICE * item.REQUEST_ITEM_COUNT) + '</td>' +
      '</tr>'
    ].join('');
    total_price += parseInt((item.ITEM_PRICE * item.REQUEST_ITEM_COUNT));

    table_body.append(template);
    $('#total_request_item_price').html('<i class="fa fa-krw"></i><span style="font-size:16px;">' + total_price + '</span>');
  }

  callback();
};

$('#arrive_table').on('click', '.arrive_lookup', function() {
  var $tr = $(this).parents('tr');
  var code = $tr.attr('data-code');

  $('.loading_bg').show();

  $.post('/arrive/arrive_item', {
    code: code
  }, function(data) {
    if (data.result) {
      var arrive_item_list = data.data;

      make_arrive_item_table(arrive_item_list, function() {
        $('.loading_bg').hide();
        $('#arrive_item_modal').modal('show');
      });
    } else {
      $('.loading_bg').hide();
      alert.show('상세 정보를 가져오는데 실패하였습니다.');
    }
  });
});

var make_arrive_item_table = function(arrive_item_list, callback) {
  var arrive_item_table = $('#arrive_item_table');
  var table_body = arrive_item_table.find('tbody');
  table_body.empty();

  for (var i = 0; i < arrive_item_list.length; i++) {
    var item = arrive_item_list[i];

    var template = [
      '<tr>' +
        '<td>' + item.ITEM_CODE + '</td>' +
        '<td>' + item.ITEM_NAME + '</td>' +
        '<td>' + item.ARRIVE_ITEM_COUNT + '</td>' +
      '</tr>'
    ].join('');

    table_body.append(template);
  }

  callback();
};

$('#request_table').on('click', '.request_lookup_arrive', function() {
  $('.loading_bg').show();
  var $tr = $(this).parents('tr');
  var request_code = $tr.attr('data-code');
  var arrive_code = request_code.replace('RQ', 'AR');

  $.post('/arrive/get', {
    code: arrive_code
  }, function(data) {
    $('.loading_bg').hide();
    if (data.result) {
      make_arrive_table(data.data);
    } else {
      alert.show('입고 목록을 가져오는데 실패하였습니다.');
    }
  });
});

var make_arrive_table = function(data) {
  $('#no_selected').hide();

  if (data.length > 0) {
    $('#arrive_table').show();
    $('#no_arrive').hide();

    var table_body = $('#arrive_table').find('tbody');
    table_body.empty();

    for (var i = 0; i < data.length; i++) {
      var arrive_date = data[i].ARRIVE_DATE;
      var parsed_date = arrive_date.slice(0, 4) + '.' + arrive_date.slice(4, 6) + '.' + arrive_date.slice(6, 8);
      var arrive_code = data[i].ARRIVE_CODE;
      var template = [
        '<tr data-code="' + arrive_code + '">' +
          '<td>' + arrive_code + '</td>' +
          '<td>' + parsed_date + '</td>' +
          '<td><div class="button-group">' +
            '<button class="btn btn-teal arrive_lookup">상세 정보</button>' +
          '</div></td>' +
        '</tr>'
      ].join('');

      table_body.append(template);
    }


  } else {
    $('#arrive_table').hide();
    $('#no_arrive').show();
  }
};

$('#add_request').on('click', function() {

});

$('#check_arrive').on('click', function() {
  if ($('#arrive_table').find('tbody').children().length > 0) {
    
  }
});
