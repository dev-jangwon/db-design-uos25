$('#lookup_sales_btn').on('click', function() {
  $.post('/sales/lookup', function(data) {
    console.log('Data : ', data);
  });
});
