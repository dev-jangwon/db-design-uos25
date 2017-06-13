alert.init('alert_modal');


$(document).ready(function() {
    $('#mileage_form_group').hide();
    $('#customer_code').attr('customer_code', '');

    /*
     판매 등록 페이지
     */

    var selling_item_object = {};
    var selling_item_ex_date = {};

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
                alert.show('고객 코드가 존재하지 않습니다.');
                return;
            }

            $('#customer_code').attr('customer_code', customer_code);

            $('#mileage_form_group').show();
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
            var item_data = data.data;
            var mileage_data = data.mileage_data[0];
            var event_data = data.event_info.data;

            var item_ex_date = item_data.ITEM_EXPIRATION_DATE;

            if (mileage_data && mileage_data !== null) {
                item_mileage_rate = mileage_data.MILEAGE_RATE;
                etc_message = "편의점 전용상품"
                var mileage_val = $('#save_mileage').val();
                $('#save_mileage').val(Number(mileage_val) + Number(item_data.ITEM_PRICE) * Number(item_mileage_rate));
            }

            if (!item_data || item_data === null) {
                alert.show('상품정보가 없습니다.');
                return;
            }

            var sale_price = item_data.ITEM_PRICE;

            var event_rate = 0;
            var event_one_plus_one = 1;

            if (event_data && event_data.length > 0) {
                for (var i = 0; i < event_data.length; i++) {
                    if (event_data[i].EVENT_INFO === "A/11") {
                        event_one_plus_one = 2;
                        if (etc_message.length > 0) {
                            etc_message += ", 1 + 1 행사";
                        } else {
                            etc_message += "1 + 1 행사";
                        }
                        break;
                    } else if (event_data[i].EVENT_INFO === "B/0.15") {
                        event_rate = 0.15;
                        if (etc_message.length > 0) {
                            etc_message += ", 15%할인 이벤트";
                        } else {
                            etc_message += "15%할인 이벤트";
                        }
                        break;
                    } else if (event_data[i].EVENT_INFO === "B/0.10") {
                        event_rate = 0.10;
                        if (etc_message.length > 0) {
                            etc_message += ", 10%할인 이벤트";
                        } else {
                            etc_message += "10%할인 이벤트";
                        }
                        break;
                    } else if (event_data[i].EVENT_INFO === "B/0.05") {
                        event_rate = 0.05;
                        if (etc_message.length > 0) {
                            etc_message += ", 5%할인 이벤트";
                        } else {
                            etc_message += "5%할인 이벤트";
                        }
                        break;
                    }
                }
            }

            selling_item_ex_date[item_data.ITEM_CODE] = item_ex_date;

            for (var i = 0; i < event_one_plus_one; i++) {
                table.row.add([
                    item_data.ITEM_CODE,
                    item_data.ITEM_NAME,
                    sale_price,
                    item_count,
                    (sale_price - item_data.ITEM_PRICE * event_rate) * item_count,
                    item_data.ITEM_PRICE * event_rate * item_count,
                    etc_message
                ]).draw('false');

                if (selling_item_object[item_data.ITEM_CODE] > 0) { // 중복
                    selling_item_object[item_data.ITEM_CODE] += Number(item_count);
                } else {
                    selling_item_object[item_data.ITEM_CODE] = Number(item_count);
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
                $('#sum_price').val(selling_price);
                $('#selling_price').val($('#sum_price').val() - discount_price - $('#cut_mileage').val());
                $('#discount_price').val(discount_price);
            }
        });

    });

    $('#use_mileage').click(function() {
        if ($('#customer_name').val() == "") {
            alert.show("고객 조회해주세요");
        }
    })

    $('#use_mileage').change(function() {
        if ($('#customer_name').val() !== "") {
            var selling_price = $('#selling_price');
            var use_mileage = $('#use_mileage');
            $('#cut_mileage').val(use_mileage.val());
            var selling_val = selling_price.val();
            selling_price.val(selling_val - use_mileage.val());
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
        var mileage_price = $('#cut_mileage').val(); // 마일리지 할인

        if (mileage_price == '') {
            mileage_price = 0;
        }

        if (selling_price == undefined || selling_price == "" || !selling_price) {
            alert.show("판매등록을 해주세요")
            return;
        }

        var customer_code = $('#customer_code').val();
        if (customer_code == undefined || customer_code == "" || !customer_code) {
            customer_code = "";
        }

        if (mileage_price !== "") {
            // selling_price -= mileage_price; // 판매 금액 - 마일리지 할인
        }

        // 고객 마일리지 적립 금액
        var customer_mileage = $('#customer_milage').val();
        if (customer_mileage == '') {
            customer_mileage = 0;
        }

        // 고객이 사용할 마일리지 금액
        var use_mileage = $('#use_mileage').val();

        if (use_mileage == '') {
            use_mileage = 0;
        }

        // 판매의 마일리지 적립
        var save_mileage = $('#save_mileage').val();
        if (save_mileage == '' || $('#customer_code').attr('customer_code') == "") {
            save_mileage = 0;
        }

        if ($('#rest_price').val() < 0 || $('#get_price').val() < 0 || $('#get_price').val() == "") {
            alert.show("금액이 모자랍니다.");
            return;
        }

        var final_mileage = Number(customer_mileage) - Number(use_mileage) + Number(save_mileage);

        if ($('#customer_code').attr('customer_code') !== "" && customer_mileage - use_mileage < 0) {
            alert.show('마일리지 사용 금액이 너무 많습니다');
            return;
        }

        var post_data = {
            'selling_price': selling_price,
            'selling_date': selling_date,
            'customer_code': customer_code,
            'selling_item_object': selling_item_object,
            'selling_item_ex_date': selling_item_ex_date,
            'mileage': final_mileage
        };

        $('#customer_code').attr('customer_code', '');

        selling_item_object = {};
        selling_item_ex_date = {};

        // 판매랑 물품 판매 모두 넣기. 판매 먼저 넣은 후 물품_판매 넣기.
        $.post('/selling/enroll', post_data, function (data) {
            if (data) {
                location.reload();
            } else {
                alert.show("판매 등록 실패");
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
