var item_list = [];

var init = function() {
  alert.init('alert_modal');

  $.post('/stock/get', {}, function(data) {
    if (data.result) {
      item_list = data.data;

      make_stock_table(data.data, function() {
        $('.loading_bg').hide();
      });
    } else {
      $('.loading_bg').hide();
      alert.show('데이터를 가져오는데 실패하였습니다.');
    }
  });
};

var stock_item_classification = [];
var total_display = 0;
var total_warehouse = 0;

var make_stock_table = function(data, callback) {
  var item_table = $('#item_table');
  var table_body = item_table.find('tbody');

  for (var i = 0; i < data.length; i++) {
    var item_code = data[i].ITEM_CODE;
    var item_name = data[i].ITEM_NAME;
    var item_classification = data[i].ITEM_CLASSIFICATION;
    var display_count = data[i].DISPLAY;
    var warehouse_count = data[i].WAREHOUSE;

    if (display_count == 0 && warehouse_count == 0) {
      continue;
    }

    total_display+=parseInt(display_count);
    total_warehouse+=parseInt(warehouse_count);

    if (stock_item_classification.indexOf(item_classification) < 0) {
      stock_item_classification.push(item_classification);
    }

    var template = [
      '<tr data-code="' + item_code + '">' +
        '<td>' + item_code + '</td>' +
        '<td>' + item_name + '</td>' +
        '<td>' + item_classification + '</td>' +
        '<td>' + display_count + '</td>' +
        '<td>' + warehouse_count + '</td>' +
      '</tr>'
    ].join('');

    table_body.append(template);
  }

  $('.warehouse_info').find('.inner > p').text('물품 총 개수 : ' + total_warehouse);
  $('.display_info').find('.inner > p').text('물품 총 개수 : ' + total_display);

  callback();
};

$('.stock_management').on('click', function() {
  $('.loading_bg').show();
  $.post('/stock/get/all', {}, function(data) {
    if (data.result) {
      item_list = data.data;

      make_stock_modal(data.data, function() {
        $('.loading_bg').hide();
        $('#stock_modal').modal('show');
      });
    } else {
      $('.loading_bg').hide();
      alert.show('데이터를 가져오는데 실패하였습니다.');
    }
  });
});

var make_stock_modal = function(data, callback) {
  var stock_table = $('#stock_table');
  var table_body = stock_table.find('tbody');

  for (var i = 0; i < data.length; i++) {
    var item_code = data[i].ITEM_CODE;
    var item_name = data[i].ITEM_NAME;
    var item_expiration_date = data[i].ITEM_EXPIRATION_DATE;
    var item_classification = data[i].ITEM_CLASSIFICATION;
    var warehouse_count = data[i].WAREHOUSE_COUNT;
    var display_count = data[i].DISPLAY_COUNT;
    var parsed_date = item_expiration_date.slice(0, 4) + '.' + item_expiration_date.slice(4, 6) + '.' + item_expiration_date.slice(6, 8);

    if (warehouse_count == 0) {
      continue;
    }

    var template = [
      '<tr data-code="' + item_code + '" data-date="' + item_expiration_date + '">' +
        '<td>' + item_code + '</td>' +
        '<td>' + item_name + '</td>' +
        '<td>' + item_classification + '</td>' +
        '<td>' + parsed_date + '</td>' +
        '<td>' + display_count + '</td>' +
        '<td>' +
          '<div class="input-group">' +
            '<input data-display="' + display_count + '" data-max="' + warehouse_count + '" type="number" class="form-control get_count" placeholder="0">' +
            '<div class="input-group-addon">/ ' + warehouse_count + '</div>' +
          '</div>' +
        '</td>' +
      '</tr>'
    ].join('');

    table_body.append(template);
  }

  callback();
};

$('#stock_manage').on('click', function() {
  $('.loading_bg').show();
  var stock_table = $('#stock_table');
  var table_body = stock_table.find('tbody');
  var rows = table_body.find('tr');
  var change_items = [];

  rows.each(function(i, e) {
    var count_box = $(e).find('.get_count');
    var count = parseInt(count_box.val());
    var max = parseInt(count_box.attr('data-max'));
    var code = $(e).attr('data-code');
    var date = $(e).attr('data-date');
    var display_count = parseInt(count_box.attr('data-display'));

    var new_warehouse_count = max - count;
    var new_display_count = display_count + count;

    if (count > 0 && count < max) {
      change_items.push({
        item_code: code,
        item_expiration_date: date,
        warehouse_count: new_warehouse_count,
        display_count: new_display_count
      });
    }
  });

  if (change_items.length > 0) {
    $.post('/stock/change', {
      data: change_items
    }, function(data) {
      if (data.result) {
        window.location.reload();
      } else {
        $('.loading_bg').hide();
        alert.show('창고에서 물건을 가져오는데 실패하였습니다.');
      }
    });
  } else {
    $('.loading_bg').hide();
    alert.show('변경 가능한 정보가 없습니다.');
  }
});
