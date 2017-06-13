/**
 * Created by jangwon on 2017. 6. 12..
 */

alert.init('alert_modal');

$(function() {

    $('#exclusive_item_delete_button').hide();

    $("#exclusive_item_enroll_button").click(function() {
        var item_code = $("#exclusive_item_code").children("option:selected").text();
        var discout_rate = $('#exclusive_item_discount').val();

        if (item_code == "" || discout_rate == "" || !item_code) {
            alert.show("정보를 입력해주세요");
            return;
        }

        if (discout_rate == 0) {
            alert.show("0은 할인율로 입력할 수 없습니다");
            return;
        }

        var post_data = {
            "item_code": item_code,
            "mileage_rate": discout_rate
        };

        if ($('#exclusive_item_enroll_button').attr('status') == "enroll") {
            $.post('/branch_item/enroll', post_data, function(data) {
                console.log(data);
            });
        } else {
            $.post('/branch_item/modify', post_data, function(data) {
                console.log(data);
            });
        }
    });

    $("#exclusive_item_delete_button").click(function() {
        var item_code = $("#exclusive_item_code").children("option:selected").text();

        var post_data = {
            "item_code": item_code
        };

        $.post('/branch_item/delete', post_data, function(data) {
            console.log(data);
        });
    });

    $("#exclusive_item_code").change(function(){
        $('#exclusive_item_name').val($(this).val());

        var item_code = $(this).children("option:selected").text();

        $.post('/branch_item/lookup', {
           'item_code': item_code
        }, function(result) {
            if (result && result.data) {
                if (result.data.length > 0 && result.data[0].MILEAGE_RATE !=="0" && result.data[0].MILEAGE_RATE !== 0) {
                    $('#exclusive_item_discount').val(result.data[0].MILEAGE_RATE);
                    $('#exclusive_item_enroll_button').text("수정");
                    $('#exclusive_item_enroll_button').attr('status', 'modify');
                    $('#exclusive_item_delete_button').show();
                } else {
                    $('#exclusive_item_discount').val("");
                    $('#exclusive_item_enroll_button').text("등록");
                    $('#exclusive_item_enroll_button').attr('status', 'enroll');
                    $('#exclusive_item_delete_button').hide();
                }
            } else {
                return;
            }
        });
    });
});
