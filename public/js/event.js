/**
 * Created by jangwon on 2017. 6. 12..
 */

dialog.init('event_dialog_modal');
alert.init('alert_modal');

$(function() {
    $("#event_enroll_button").click(function() {
        var event_name = $("#event_name").val();
        var event_info = $("#event_info").val();
        var event_desc = $("#event_desc").val();
        var event_term = $("#event_term").val();
        var event_items = $("#event_items").val();

        if (event_name == "" || event_info == "" || event_desc == "" || event_term == "" || !event_items) {
            alert.show("이벤트정보를 입력해주세요");
            return;
        }

        var post_data = {
            "event_name": event_name,
            "event_info": event_info,
            "event_desc": event_desc,
            "event_term": event_term,
            "event_items": event_items
        };

        $.post('/event/enroll', post_data, function(data) {
            console.log(data);
        });
    });

    $('#event_view_table').on('click', 'tr', function() {
        var row = event_view_table.row(this).data();

        $.get('/event/item/lookup', {
            'event_code': row[0]
        }, function(result) {
            var data = result.data;

            var info;
            $("#event_dialog_modal_items").empty();

            for (var i = 0; i < data.length; i++) {
                var item_code = data[i].ITEM_CODE;
                var item_name = data[i].ITEM_NAME;
                info = data[i].EVENT_INFO;
                $("#event_dialog_modal_items").append("<option value=" + data[i].ITEM_CODE + ">" + data[i].ITEM_NAME + "</option>");
            }

            $('#event_dialog_modal_info option[value="'+info+'"]').attr("selected","selected");

            var obj = {
                'event_dialog_modal_code': row[0],
                'event_dialog_modal_name': row[1],
                'event_dialog_modal_desc': row[2],
                'event_dialog_modal_term': row[3]
            }
            dialog.show(obj);
        });
    });

    $('#event_lookup_modify').click(function(e) {
        var post_data = {
            "event_code": $('#event_dialog_modal_code').val(),
            "event_name": $('#event_dialog_modal_name').val(),
            "event_desc": $('#event_dialog_modal_desc').val(),
            "event_term": $('#event_dialog_modal_term').val(),
            "event_info": $('#event_dialog_modal_info').val()
        };

        $.post('/event/item/modify', post_data, function (data) {
            if (data && data.result) {
                location.reload();
            } else {
                alert.show("이벤트 수정 실패");
            }
        });

        e.stopPropagation();
    });

    $('#event_lookup_delete').click(function(e) {
        var post_data = {
            "event_code": $('#event_dialog_modal_code').val()
        };

        $.post('/event/item/delete', post_data, function (data) {
            if (data && data.result) {
                location.reload();
            } else {
                alert.show("이벤트 삭제 실패");
            }
        });

        e.stopPropagation();
    });
});