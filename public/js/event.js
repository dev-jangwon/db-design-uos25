/**
 * Created by jangwon on 2017. 6. 12..
 */

$(function() {
    $("#event_enroll_button").click(function() {
        var event_name = $("#event_name").val();
        var event_info = $("#event_info").val();
        var event_desc = $("#event_desc").val();
        var event_term = $("#event_term").val();
        var event_items = $("#event_items").val();

        if (event_name == "" || event_info == "" || event_desc == "" || event_term == "" || !event_items) {
            alert("이벤트정보를 입력해주세요");
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
});