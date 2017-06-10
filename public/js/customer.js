var table = $('#selling_table').DataTable();


/* 날자 구하는 함수 */
function getTimeStamp() {
  var d = new Date();

  var s =
    leadingZeros(d.getFullYear(), 2) + '/' +
    leadingZeros(d.getMonth() + 1, 2) + '/' +
    leadingZeros(d.getDate(), 2);

  return s;
}

function leadingZeros(n, digits) {
  var zero = '';
  n = n.toString();

  if (n.length < digits) {
    for (i = 0; i < digits - n.length; i++)
      zero += '0';
  }
  return zero + n;
}


$('#lookup_customer_btn').on('click', function() {
  var customer_code = $('#customer_code').val();


  var post_data_customer = {
    customer_code: customer_code
  };


  $.post('/customer/lookup', post_data_customer, function (data) {
    var customer_data = data.data;

    // if(typeof data.length == "undefined") {
    //   alert('고객 코드가 존재하지 않습니다.');
    //   return;
    // }
    if (customer_data.length == 0) {
      $('#customer_alert').css("display","block");
      $('#customer_code').val("");
      $('#customer_name').val("");
      $('#customer_milage').val("");
      return;
    }

    $('#customer_milage').val(customer_data[0].CUSTOMER_MILEAGE);
    $('#customer_name').val(customer_data[0].CUSTOMER_NAME);
    $('#customer_alert').css("display","none");
  });


});
//
// $('#create_sale_btn').on('click', function () {
//   var item_code = $('#item_code').val();
//
//   var post_data_item = {
//     item_code: item_code
//   };
//
//   $.post('/item/lookup', post_data_item, function (data) {
//     item_data = data.data;
//     console.log(item_data);
//     if (item_data.length == 0) {
//       alert('상품정보가 없습니다.');
//       return;
//     }
//
//   })
// });

/*
  Table 관련.
*/

$(document).ready(function() {
  var item_data;
  var branch_item_data;
  var item_discount;
  var mileage_sum = 0;



  $('#create_sale_btn').on( 'click', function () {
    var item_code = $('#item_code').val();
    var item_count = $('#item_count').val();
    var item_mileage_rate = 0;
    // 아이템 하나당 판매가격
    var selling_price = 0;

    item_discount = 0;

    // item_count에 아무것도 안써있을시 1로 설정.
    if (item_count == "") {
      item_count = 1
    }

    var post_data_item = {
      item_code: item_code
    };

    // var post_data_branch_item = {
    //   branch_item_code : item_code
    // }


    /* 물품정보 조회*/
    $.post('/item/lookup', post_data_item, function (data) {
      item_data = data.data;
      //data.mileage_data 가 없다면
      //branch_item_data에 null;
      if(data.mileage_data.length == 0){
        branch_item_data = null;
        $('#branch_item_code').val($('#item_code').val());
        $('#branch_item_name').val('편의점 전용상품이 아닙니다.');
        $('#mileage_rate').val('');
        $('#mileage_price').val('');
      }else{
        // bracn_item_data = data.mileage_data[0];
        item_mileage_rate = data.mileage_data[0].MILEAGE_RATE;
      }

      if (item_data.length == 0) {
        alert('상품정보가 없습니다.');
        return;
      }

      sale_price = item_count * item_data[0].ITEM_PRICE - item_discount;

      table.row.add( [
        item_data[0].ITEM_CODE,
        item_data[0].ITEM_NAME,
        item_data[0].ITEM_PRICE,
        item_count,
        sale_price,
        item_discount,
        ''
      ] ).draw('false');

      selling_price = table.column(4).data().reduce( function (a,b) {
        return a+b;
      });
      $('#selling_price').val(selling_price);

      var mileage_price = 0;

      mileage_price = item_data[0].ITEM_PRICE * item_mileage_rate;
      $('#branch_item_code').val(item_data[0].ITEM_CODE);
      $('#branch_item_name').val(item_data[0].ITEM_NAME);
      $('#mileage_rate').val(item_mileage_rate);
      $('#mileage_price').val(mileage_price);
      mileage_sum+=mileage_price;
    });

  } );
} );

/*
  합계 금액 입력시 거스름돈 계산.
*/
$('#get_price').change(function() {
    var selling_price = $('#selling_price').val();
    var discount_price = $('discount_price').val();
    if($('discount_price').val() == undefined){
      discount_price = 0;
    }
    var get_price = $('#get_price').val();
    var rest_price = 0;
    rest_price = get_price - selling_price - discount_price;
    $('#rest_price').val(rest_price);

});

/*
    판매 버튼 누를시
*/
$('#selling_complete').on("click", function() {
  var hello = table.column(4).data();
  var selling_price = $('#selling_price').val();
  var date = getTimeStamp();
  // console.log(date);
  // console.log(typeof(date));
  var array_data = [];
  var customer_code = $('#customer_code').val();
  if (customer_code == undefined) {
    customer_code = "";
  }

  var post_data = {
    selling_price: selling_price,
    selling_date: date,
    customer_code: customer_code
  };

  var selling_code = table.column(0).data();
  var selling_count = table.column(3).data();

  

  console.log(selling_count);

  //판매랑 물품 판매 모두 넣기. 판매 먼저 넣은 후 물품_판매 넣기.
  // $.post('/selling/enroll',post_data,function(data){
  //   $.post('/selling_item/enroll'){
  //
  //   }
  // });
});


/*

  server에서 잘 받는것까지 확인함.
  이제 판매 누를시 판매 생성, 물품_판매 생성 진행.
  마일리지 관련 할인 프로그래밍 진행 요망.

*/
