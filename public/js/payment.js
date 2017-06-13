/**
 * Created by jangwon on 2017. 6. 13..
 */

$(function() {
    var get_date_string = function(date) {
        date = date.toLocaleDateString().replace(/\ /g, '');
        var splited = date.split('.');
        if (splited[1].length == 1) {
            splited[1] = '0' + splited[1];
        }
        if (splited[2].length == 1) {
            splited[2] = '0' + splited[2];
        }
        date = splited.join('');
        return date;
    };

    var current_date = new Date();

    var month_ago = new Date();
    var m = month_ago.getMonth();
    month_ago.setMonth(month_ago.getMonth() - 1);
    month_ago.setDate(27);

    current_date = get_date_string(current_date);
    month_ago = get_date_string(month_ago);

    $('#payment_branch').val('UOS001');
    $('#payment_term').val(month_ago + ' ~ ' + current_date);

    var post_data = {
        'before_date': month_ago,
        'current_date': current_date,
        'branch_code': 'UOS001'
    }

    $.post('/payment/lookup',post_data, function (result) {
        if (result && result.data) {
            var obj = result.data;
            $('#payment_selling').val(obj.selling_sum);
            $('#payment_employee').val(obj.employee_sum);
            $('#payment_maintainance').val(obj.branch_maintenance);
            $('#payment_percentage').val(obj.branch_percent);
            $('#payment_sum').val(obj.payment);
        }
    });

    $('#payment_enroll_button').on('click', function(e) {
        var branch_code = $('#payment_branch').val();
        var payment = $('#payment_sum').val();
        var date = current_date;

        var post_data = {
            'branch_code': branch_code,
            'payment_price': payment,
            'payment_date': date
        };

        $.post('/payment/enroll',post_data, function (result) {
            location.reload();
        });
    });
});



