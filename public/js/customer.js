/**
 * Created by jangwon on 2017. 6. 12..
 */

dialog.init('customer_dialog_modal')

$(function() {
    $("#customer_enroll_button").click(function() {
        var customer_name = $("#customer_name").val();
        var customer_phone = $("#customer_phone").val();
        var customer_age = $("#customer_age").val();
        var customer_sex = $("#customer_sex").val();

        if (customer_name == "" || customer_phone == "" || customer_age == "" || customer_sex == "") {
            alert("고객 정보를 입력해주세요");
            return;
        }

        var post_data = {
            "customer_name": customer_name,
            "customer_phone_number": customer_phone,
            "customer_age": customer_age,
            "customer_sex": customer_sex
        };

        $.post('/customer/enroll', post_data, function(data) {
            console.log(data);
        });
    });

    $('#customer_view_table').on('click', 'tr', function() {
        var row = customer_view_table.row(this).data();

        var obj = {
            'customer_dialog_modal_code': row[0],
            'customer_dialog_modal_name': row[1],
            'customer_dialog_modal_phone': row[2],
            'customer_dialog_modal_age': row[3],
            'customer_dialog_modal_sex': row[4],
            'customer_dialog_modal_mileage': row[5]
        }
        dialog.show(obj);
    });

    $('#customer_lookup_modify').click(function(e) {
        var post_data = {
            "customer_code": $('#customer_dialog_modal_code').val(),
            "customer_name": $('#customer_dialog_modal_name').val(),
            "customer_phone_number": $('#customer_dialog_modal_phone').val(),
            "customer_age": $('#customer_dialog_modal_age').val(),
            "customer_sex": $('#customer_dialog_modal_sex').val(),
            "customer_mileage": $('#customer_dialog_modal_mileage').val()
        };

        $.post('/customer/modify', post_data, function (data) {
            if (data && data.result) {
                location.reload();
            } else {
                alert("실패");
            }
        });

        e.stopPropagation();
    });

    $('#customer_lookup_delete').click(function(e) {
        var post_data = {
            "customer_code": $('#customer_dialog_modal_code').val()
        };

        $.post('/customer/delete', post_data, function (data) {
            if (data && data.result) {
                location.reload();
            } else {
                alert("실패");
            }
        });

        e.stopPropagation();
    });
});