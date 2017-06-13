
dialog.init('service_dialog_modal');
alert.init('alert_modal');

$(function() {
    $('#service_treeview').click();

  $("#service_enroll_button").click(function() {
    var service_name = $("#service_name").val();
    var service_info = $("#service_info").val();
    var branch_code = $("#branch_code").val();

    if (service_name == "" || service_info == "") {
      alert.show('서비스 정보를 입력해주세요.');
      return;
    };

    var post_data = {
      "service_name": service_name,
      "service_info": service_info,
      "branch_code": branch_code
    };

    $.post('/service/enroll', post_data, function(data) {
    });
  });

  $('#service_view_table').on('click', 'tr', function() {
    var row = service_view_table.row(this).data();
    var obj = {
      'service_dialog_modal_code' : row[0],
      'service_dialog_modal_name' : row[1],
      'service_dialog_modal_info' : row[2],
      'service_dialog_modal_branch_name' : row[3]
    }
    dialog.show(obj);
  });

  // 글수정.
  $('#service_lookup_modify').click(function(e) {
    var post_data = {
      'service_code': $('#service_dialog_modal_code').val(),
      'service_name': $('#service_dialog_modal_name').val(),
      'service_info': $('#service_dialog_modal_info').val()
    }

    $.post('/service/modify', post_data, function(result) {
      if (result && result.result) {
        location.reload();
      } else {
        alert.show('수정 실패');
      }
    });
    e.stopPropagation();
  });

  // 글삭제.
  $('#service_lookup_delete').click(function(e) {
    var post_data = {
      'service_code': $('#service_dialog_modal_code').val()
    }

    $.post('/service/delete', post_data, function(result) {
      if (result && result.result) {
        location.reload();
      } else {
        alert.show('삭제 실패');
      }
    });
    e.stopPropagation();
  })


});
