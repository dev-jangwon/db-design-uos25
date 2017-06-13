dialog.init('sale_dialog_modal');

$(document).ready(function() {

  $('#selling_view_table').on('click', 'tr', function() {
    var row = view_table.row(this).data();
    //실제 판매금액
    var real_selling_price = row[1];
    var sale_item_view_table = $('#sale_item_view_table').DataTable({
      dom : 't'
    });

    var post_data = {
      SELLING_CODE : row[0]
    }
    $.post('/selling_item/lookup', post_data, function (data) {
      var selling_item_data = data.data;
      // 원래 판매 금액
      var selling_value = 0;
      var discount_value = 0;
      console.log(selling_item_data);
      console.log(selling_item_data.length);
      for(var i = 0; i < selling_item_data.length; i++){
        sale_item_view_table.row.add([
          selling_item_data[i].ITEM_NAME,
          selling_item_data[i].SELLING_ITEM_COUNT,
          selling_item_data[i].ITEM_PRICE
        ]).draw('false');
        selling_value += selling_item_data[i].ITEM_PRICE * selling_item_data[i].SELLING_ITEM_COUNT;
        $('#selling_price').val(selling_value);
        discount_value = selling_value - real_selling_price;
        $('#discount_value').val(discount_value);
        $('#sale_item_price').val(real_selling_price) ;
      }

    });

    // var selling_item_table = $('#sale_item_view_table').DataTable({
    //   dom: 't'
    // });

    dialog.show({}, function() {
      location.reload();
    });
  });
});
