/**
 * Created by jangwon on 2017. 6. 12..
 */

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

});