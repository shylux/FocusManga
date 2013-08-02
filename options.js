$(function() {
  // init values
  $('#timer_enabled').prop('checked', (localStorage['timer_enabled']=='true'));
  $('#timer_delay').val(localStorage['timer_delay']);

  // save handler
  $('#timer_enabled').click(function() {
    localStorage['timer_enabled'] = this.checked;
  });
  $('#timer_delay').keyup(function() {
    localStorage['timer_delay'] = $(this).val();
  });
});
