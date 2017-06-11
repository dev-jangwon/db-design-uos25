$(document).ready(function() {
    /*
     판매 등록 페이지
     */

    var selling_item_object = {};

    var table = $('#selling_table').DataTable({
        dom: 't'
    });

    $('#lookup_customer_btn').on('click', function () {
        var customer_code = $('#customer_code').val();

        var post_data_customer = {
            customer_code: customer_code
        };

        $.post('/customer/lookup', post_data_customer, function (data) {
            var customer_data = data.data[0];

            if (!customer_data || customer_data == null) {
                alert('고객 코드가 존재하지 않습니다.');
                return;
            }

            $('#customer_milage').val(customer_data.CUSTOMER_MILEAGE);
            $('#customer_name').val(customer_data.CUSTOMER_NAME);
        });
    });

    $('#create_sale_btn').on('click', function () { // 물품 등록
        var item_code = $('#item_code').val(); // 물품 코드
        var item_count = $('#item_count').val(); // 물품 개수

        // item_count에 아무것도 안써있을시 1로 설정.
        if (item_count == "") {
            item_count = 1;
        }

        var item_mileage_rate = 0; // 편의점 전용상품 할인율
        var etc_message = "";

        $.post('/item/lookup', { item_code: item_code }, function (data) {
            var item_data = data.data[0];
            var mileage_data = data.mileage_data[0];

            if (mileage_data && mileage_data !== null) {
                item_mileage_rate = mileage_data.MILEAGE_RATE;
                etc_message = "편의점 전용상품"
            }

            if (!item_data || item_data == null) {
                alert('상품정보가 없습니다.');
                return;
            }

            var sale_price = item_count * item_data.ITEM_PRICE - (item_data.ITEM_PRICE * item_mileage_rate);

            table.row.add([
                item_data.ITEM_CODE,
                item_data.ITEM_NAME,
                item_data.ITEM_PRICE,
                item_count,
                sale_price,
                item_data.ITEM_PRICE * item_mileage_rate,
                etc_message
            ]).draw('false');

            if (selling_item_object[item_data.ITEM_CODE] > 0) { // 중복
                selling_item_object[item_data.ITEM_CODE] += item_count;
            } else {
                selling_item_object[item_data.ITEM_CODE] = item_count;
            }

            var sum_price = table.column(2).data().reduce(function(a,b) {
               return a + b;
            });

            var selling_price = table.column(4).data().reduce(function (a, b) {
                return a + b;
            });

            var discount_price = table.column(5).data().reduce(function (a, b) {
              return a + b;
            });
            $('#sum_price').val(sum_price);
            $('#selling_price').val(selling_price);
            $('#discount_price').val(discount_price);
        });

    });

    $('#use_mileage').click(function() {
        if ($('#customer_name').val() == "") {
            alert("고객 조회해주세요");
        }
    })

    $('#use_mileage').change(function() {
        if ($('#customer_name').val() !== "") {
            $('#cut_mileage').val($(this).val());
            var selling_price = $('#selling_price').val();
            $('#selling_price').val(selling_price - $(this).val());ƒf
        }
    });

    /*
     합계 금액 입력시 거스름돈 계산.
     */
    $('#get_price').change(function () {
        var selling_price = $('#selling_price').val();
        var discount_price = $('discount_price').val();
        if ($('discount_price').val() == undefined) {
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
    $('#selling_complete').on("click", function () {
        // var date = getTimeStamp();
        var date = new Date();
        var year = date.getFullYear().toString();
        var month = (date.getMonth() + 1).toString();
        if (month.length == 1) {
            month = "0" + month;
        }
        var day = date.getDate().toString();
        var selling_date = year + month + day;

        var selling_price = $('#selling_price').val();
        var mileage_price = $('#cut_mileage').val();

        if (selling_price == undefined || selling_price == "" || !selling_price) {
            alert("판매등록을 해주세요")
            return;
        }

        var customer_code = $('#customer_code').val();
        if (customer_code == undefined || customer_code == "" || !customer_code) {
            customer_code = "";
        }

        if (mileage_price !== "") {
            selling_price -= mileage_price;
        }

        var post_data = {
            selling_price: selling_price,
            selling_date: selling_date,
            customer_code: customer_code,
            selling_item_object: selling_item_object
        };

        // 판매랑 물품 판매 모두 넣기. 판매 먼저 넣은 후 물품_판매 넣기.
        $.post('/selling/enroll', post_data, function (data) {
            console.log(data);
            if (data) {
                location.reload();
            } else {
                alert("실패");
            }
        });
    });

    // /* 날자 구하는 함수 */
    // function getTimeStamp() {
    //     var d = new Date();
    //
    //     var s =
    //         leadingZeros(d.getFullYear(), 2) + '/' +
    //         leadingZeros(d.getMonth() + 1, 2) + '/' +
    //         leadingZeros(d.getDate(), 2);
    //
    //     return s;
    // }
    //
    // function leadingZeros(n, digits) {
    //     var zero = '';
    //     n = n.toString();
    //
    //     if (n.length < digits) {
    //         for (i = 0; i < digits - n.length; i++)
    //             zero += '0';
    //     }
    //     return zero + n;
    // }

    /*
     판매 내역 조회 페이지
     */


});
