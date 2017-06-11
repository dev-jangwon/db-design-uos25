
$('#sign_in_btn').on('click', function() {
  var url = btoa(window.location.href);
  window.location.href = '/login?q=' + url;
});

$('#sign_out_btn').on('click', function() {
  $.post('/signout', function() {
    window.location.href = '/';
  });
});

var rank = {
  master: '지점장',
  employee: '직원'
}

if (session == 'true') {
  $('#sign_in_btn').hide();
  $('.user_name').text(user_data.EMPLOYEE_NAME);
  $('.user-menu').show();
  $('.user-panel').show();
  var start_date = user_data.WORK_START_DATE;
  start_date = start_date.slice(0, 4) + '.' + start_date.slice(4, 6) + '.' + start_date.slice(6, 8);
  var start_info = '<small class="start_date">Member since Nov. 2012</small>';
  $('#user_info').html(user_data.EMPLOYEE_NAME + ' - ' + rank[user_data.EMPLOYEE_RANK] + start_info);
} else {
  $('#sign_in_btn').show();
  $('.user-menu').hide();
  $('.user-panel').hide();
}
