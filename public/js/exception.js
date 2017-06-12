/**
 * Created by jangwon on 2017. 6. 12..
 */

$(function() {
    var date = new Date();
    date = date.toLocaleDateString().replace(/\ /g, '');
    var splited = date.split('.');
    if (splited[1].length == 1) {
        splited[1] = '0' + splited[1];
    }
    date = splited.join('');

    $('#exception_date').val(date);

    $('#exception_customer_form').hide();

    $('#exception_class').on('change', function() {
        if ($(this).val() == "EX1") {
            $('#exception_customer_form').show();
        } else {
            $('#exception_customer_form').hide();
        }
        $('#exception_customer').attr('customer_id', "");
    });

    $('#exception_customer_search_button').on('click', function(e) {
        var customer_code = $('#exception_customer_search').val();
        if (!customer_code || customer_code == undefined || customer_code == "") {
            alert("고객 코드를 입력해주세요");
            return;
        }

        var post_data_customer = {
            customer_code: customer_code
        };

        $.post('/customer/lookup', post_data_customer, function (data) {
            var customer_data = data.data[0];

            if (!customer_data || customer_data == null) {
                alert('고객 코드가 존재하지 않습니다.');
                return;
            }

            $('#exception_customer').val(customer_data.CUSTOMER_NAME);
            $('#exception_customer').attr('customer_id', customer_code);
        });

        e.stopPropagation();
    });

    $('#exception_enroll_button').on('click', function() {
        var item_code = $('#exception_name').val();
        var exception_date = $('#exception_date').val();
        var exception_class = $('#exception_class').val();
        var exception_count = $('#exception_count').val();
        var customer_id = $('#exception_customer').attr('customer_id');

        if (item_code == "" || exception_date == "" || exception_class == "" || exception_count == "") {
            alert("예외물품 정보를 입력해주세요.");
            return;
        }

        if (exception_class == "EX1" && (customer_id == "" || !customer_id)) {
            alert("고객정보를 입력해주세요.");
            return;
        }

        var post_data = {
            "except_do_date": exception_date,
            "item_code": item_code,
            "except_type_code": exception_class,
            "branch_code": 'UOS001',
            "customer_code": customer_id ? customer_id : "",
            "except_item_count": exception_count
        };

        $.post('/exception/enroll', post_data, function(data) {
            location.reload();
        });
    });
});
