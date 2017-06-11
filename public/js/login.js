
alert.init('alert_modal');

if (no_session == 'no_session') {
  alert.show('접근 권한이 없습니다.\n로그인 후 이용해 주세요.', function() {
    $('input[type="id"]').focus();
  });
}

var saved_id = localStorage.getItem('id');

if (saved_id) {
  $('input[type="id"]').val(saved_id);
}


var signin = function() {
  var id = $('input[type="id"]').val();
  var password = $('input[type="password"]').val();
  var remember = $('input[type="checkbox"]:checked').length;

  var post_data = {
    id: id,
    password: password
  };

  if (!id) {
    alert.show('ID를 입력해주세요.', function() {
      $('input[type="id"]').focus();
    });
    return;
  }
  if (!password) {
    alert.show('비밀번호를 입력해주세요.', function() {
      $('input[type="password"]').focus();
    });
    return;
  }

  $.post('/signin', post_data, function(result) {
    if (result.result) {
      if (remember > 0) {
        localStorage.setItem('id', id);
      }
      console.log(back_url);
      window.location.href = back_url;
    } else {
      alert.show('로그인에 실패하였습니다. ID 또는 비밀번호를 확인해주세요.', function() {
        $('input[type="password"]').select().focus();
      });
    }
  });
};

$('#sign_in_btn').on('click', signin);

$('.input_box').on('keydown', function(e) {
  if (e.keyCode == 13) {
    signin();
  }
});
