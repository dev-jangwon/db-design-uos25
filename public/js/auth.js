$('#sign_in_btn').on('click', function() {
  var url = btoa(window.location.href);
  window.location.href = '/login?q=' + url;
});

if (session == 'true') {
  $('#sign_in_btn').hide();
  $('.user_name').text(user_data.EPLOYEE_NAME);
  $('.user-menu').show();
  $('.user-panel').show();
} else {
  $('#sign_in_btn').show();
  $('.user-menu').hide();
  $('.user-panel').hide();
}
console.log('user_data: ', user_data);
