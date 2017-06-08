var item_data;
$('#lookup_customer_btn').on('click', function() {
  var customer_code = $('#customer_code').val();


  var post_data_customer = {
    customer_code: customer_code
  };


  $.post('/customer/lookup', post_data_customer, function(data) {
    console.log(data);
    console.log('--------------------');
    var customer_data = data.data;
    console.log('customer_data length --------------');
    console.log(customer_data.length);

    // if(typeof data.length == "undefined") {
    //   alert('고객 코드가 존재하지 않습니다.');
    //   return;
    // }
    if (customer_data.length == 0) {
      $('#customer_alert').css("display","block");
      $('#customer_name').val("");
      $('#customer_milage').val("");
      console.log($(".alert"));
      return;
    }

    $('#customer_milage').val(customer_data[0].CUSTOMER_MILEAGE);
    $('#customer_name').val(customer_data[0].CUSTOMER_NAME);
  });


});

$('#create_sale_btn').on('click', function() {
  var item_code = $('#item_code').val();

  var post_data_item = {
    item_code: item_code
  };

  $.post('/item/lookup', post_data_item, function(data) {
    item_data = data.data;
    console.log(item_data);
    if (item_data.length == 0) {
      alert('상품정보가 없습니다.');
      return;
    }


    // $.post('/item/enroll', item_data, function(data) {
    //
    // });
    // console.log('item data : ' + item_data.data);
    // console.log(item_data);
  })
});

/*
  Table 관련.
*/

$(document).ready(function() {

    $('#selling_table').DataTable ( {
      processing: true,
      serverSide: true,
      "ajax" : {
          "url" :  "/item/lookup",
          "dataSrc" : ""
      },
      "columns" : [
          { data : "ITEM_CODE" },
          { data : "ITEM_NAME" },
          { data : "ITEM_PRICE" },
          { data : "ITEM_COUNT" },
          { data : "ITEM_TOTAL_PRICE" },
          { data : "ITEM_DISCOUNT" },
          { data : "ITEM_ETC" }
     ]
    } );

} );
