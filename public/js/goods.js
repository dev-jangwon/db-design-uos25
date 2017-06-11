/**
 * Created by jangwon on 2017. 6. 10..
 */

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
        var item_ex_date = $("#item_ex_date").val();
        var item_image = $("#item_image_input")[0];

        var item_expiration_date = item_ex_date;

        if (item_ex_date == "") {
            item_expiration_date = "99999999";
        }

        if (item_name == "" || item_price == "" || item_class == "") {
            alert("물품정보를 입력해주세요");
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
            "item_price": item_price,
            "item_expiration_date": item_expiration_date
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
        })
    });
});

