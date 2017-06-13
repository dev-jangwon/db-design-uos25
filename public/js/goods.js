/**
 * Created by jangwon on 2017. 6. 10..
 */

dialog.init('item_dialog_modal');
alert.init('alert_modal');

$(function() {
    // $('#item_ex_date').datepicker();

    $("#item_image_input").on('change', function() {
        readURL(this);
    });

    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();

            reader.onload = function (e) {
                $('#item_image').attr('src', e.target.result);
            }

            reader.readAsDataURL(input.files[0]);

            $("#item_image").show();
        }
    }

    $("#item_enroll_button").click(function() {
        var item_name = $("#item_name").val();
        var item_class = $("#item_class").val();
        var item_price = $("#item_price").val();
        var item_image = $("#item_image_input")[0];

        if (item_name == "" || item_price == "" || item_class == "") {
            alert.show("물품정보를 입력해주세요");
            return;
        }

        // var form_data = new FormData();
        //
        // form_data.append("item_name", item_name);
        // form_data.append("item_class", item_class);
        // form_data.append("item_price", item_price);
        // form_data.append("item_ex_date", item_ex_date);
        // if (item_image.files && item_image.files[0]) {
        //     form_data.append('item_image', item_image.files[0]);
        // }

        // var item_expiration_date = getTimeStamp();

        var post_data = {
            "item_name": item_name,
            "item_classification": item_class,
            "item_price": item_price
        };
        //
        // $.ajax({
        //     url: '/item/enroll',
        //     // processData: false,
        //     // contentType: false,
        //     data: post_data,
        //     type: 'POST',
        //     success: function(result){
        //         console.log(result);
        //     }
        // });

        $.post('/item/enroll', post_data, function(data) {
            console.log(data);
        });
    });

    $('#item_view_table').on('click', 'tr', function() {
        var row = item_view_table.row(this).data();
        var obj = {
            'item_dialog_modal_code': row[0],
            'item_dialog_modal_barcode': row[1],
            'item_dialog_modal_name': row[2],
            'item_dialog_modal_price': row[3],
            'item_dialog_modal_class': row[4]
        }
        dialog.show(obj);
    });

    $('#item_lookup_modify').click(function(e) {
        var post_data = {
            "item_code": $('#item_dialog_modal_code').val(),
            "item_barcode": $('#item_dialog_modal_barcode').val(),
            "item_name": $('#item_dialog_modal_name').val(),
            "item_classification": $('#item_dialog_modal_class').val(),
            "item_price": $('#item_dialog_modal_price').val()
        };

        $.post('/item/modify', post_data, function (data) {
            if (data && data.result) {
                location.reload();
            } else {
                alert.show("물품 수정 실패");
            }
        });

        e.stopPropagation();
    });

    $('#item_lookup_delete').click(function(e) {
        var post_data = {
            "item_code": $('#item_dialog_modal_code').val()
        };

        $.post('/item/delete', post_data, function (data) {
            if (data && data.result) {
                location.reload();
            } else {
                alert.show("물품 삭제 실패");
            }
        });

        e.stopPropagation();
    });
});

