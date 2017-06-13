var branch_code = 'UOS001';
var request_list = [];

var init = function() {
  alert.init('alert_modal');

  $.post('/request/get', {
    branch_code: 'UOS001'
  }, function(data) {
    if (data.result) {
      request_list = data.requests;

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
  var arrive_code = $tr.attr('data-code');
  var request_code = arrive_code.replace('AR', 'RQ');

  $('.loading_bg').show();

  $.post('/arrive/arrive_item', {
    arrive_code: arrive_code,
    request_code: request_code
  }, function(data) {
    if (data.result) {
      var arrive_item_list = data.arrive_item;
      var request_item_list = data.request_item;

      $('#arrive_item_modal').attr('data-code', arrive_code);

      make_arrive_item_table(arrive_item_list, request_item_list, function() {
        $('.loading_bg').hide();
        $('#arrive_item_modal').modal('show');
      });
    } else {
      $('.loading_bg').hide();
      alert.show('상세 정보를 가져오는데 실패하였습니다.');
    }
  });
});

var make_arrive_item_table = function(arrive_item_list, request_item_list, callback) {
  var arrive_item_table = $('#arrive_item_table');
  var table_body = arrive_item_table.find('tbody');
  table_body.empty();

  for (var i = 0; i < request_item_list.length; i++) {
    var item = request_item_list[i];
    var arrive_item_count = 0;

    for (var j = 0; j < arrive_item_list.length; j++) {
      if (arrive_item_list[j].ITEM_CODE == item.ITEM_CODE) {
        arrive_item_count = arrive_item_list[j].ARRIVE_ITEM_COUNT;
        break;
      }
    }

    var template = [
      '<tr>' +
        '<td>' + item.ITEM_CODE + '</td>' +
        '<td>' + item.ITEM_NAME + '</td>' +
        '<td>' + item.REQUEST_ITEM_COUNT + '</td>' +
        '<td>' + arrive_item_count + '</td>' +
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

var item_list = [];
var request_list = [];

$('#add_request').on('click', function() {
  request_list = [];
  $('#add_request_table').find('tbody').empty();
  var item_select = $('#add_item_code');

  item_select.empty();

  $('#total_add_request_price').html('<i class="fa fa-krw"></i><span style="font-size:16px;">0</span>');
  $('#add_item_count').val(0);

  $.get('/item/lookup/all', function (data) {
      item_list = data.data;

      for (var i = 0; i < item_list.length; i++) {
        var template = [
          '<option price="' + item_list[i].ITEM_PRICE + '" value="' + item_list[i].ITEM_CODE + '">',
            item_list[i].ITEM_NAME,
          '</option>'
        ].join('');
        item_select.append(template);
      }
      $('#add_request_modal').modal('show');
  });
});

$('#add_item_btn').on('click', function() {
  var item_select = $('#add_item_code');
  var code = item_select.val();
  var name = $('#add_item_code > option:selected').text();
  var price = $('#add_item_code > option:selected').attr('price');
  var count = $('#add_item_count').val();
  var table = $('#add_request_table');
  var tbody = table.find('tbody');
  var total_price = parseInt(price) * parseInt(count);
  var new_price = parseInt($('#total_add_request_price > span').text()) + total_price;

  if (count <= 0) {
    alert.show('주문할 물품의 개수를 입력해주세요.', function() {
      $('#add_item_count').focus();
    });
    return;
  }

  var template = [
    '<tr data-code="' + code + '">' +
      '<td>' + name + '</td>' +
      '<td><i class="fa fa-krw"></i>' + price + '</td>' +
      '<td>' + count + '</td>' +
      '<td><i class="fa fa-krw"></i>' + total_price + '</td>' +
    '</tr>'
  ].join('');

  request_list.push({
    item_code: code,
    item_count: count
  });
  $('#total_add_request_price > span').text(new_price);
  tbody.append(template);
});

$('#add_request_btn').on('click', function() {
  var date = new Date();
  date = date.toLocaleDateString().replace(/\ /g, '');
  var splited = date.split('.');
  if (splited[1].length == 1) {
    splited[1] = '0' + splited[1];
  }
  if (splited[2].length == 1) {
    splited[2] = '0' + splited[2];
  }
  date = splited.join('');

  $.post('/request/add', {
    data: request_list,
    date: date,
    branch_code: 'UOS001'
  }, function(data) {
    if (data.result) {
      window.location.reload();
    } else {
      alert.show('주문 등록에 실패하였습니다.');
    }
  });
});

$('#add_item_count').on('keydown', function(e) {
  if (e.keyCode == 13) {
    $('#add_item_btn').click();
  }
})

$('#confirm_arrive').on('click', function() {
  var arrive_code = $('#arrive_item_modal').attr('data-code');
  $('.loading_bg').show();

  $.post('/arrive/confirm', {
    code: arrive_code
  }, function(data) {
    if (!data.result) {
      $('.loading_bg').hide();
      alert.show('입고 확인 처리에 실패하였습니다.');
    } else {
      window.location.reload();
    }
  });
});

$('#rearrive').on('click', function() {
  var arrive_code = $('#arrive_item_modal').attr('data-code');
  $('.loading_bg').show();

  $.post('/arrive/rearrive', {
    code: arrive_code
  }, function(data) {
    if (!data.result) {
      $('.loading_bg').hide();
      alert.show('재입고 신청 처리에 실패하였습니다.');
    } else {
      window.location.reload();
    }
  });
});
