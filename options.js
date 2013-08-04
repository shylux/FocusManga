$(function() {
  // init values
  $('#focusmanga_enabled').prop('checked', (localStorage['focusmanga_enabled']=='true'));
  $('#timer_enabled').prop('checked', (localStorage['timer_enabled']=='true'));
  $('#timer_delay').val(localStorage['timer_delay']);

  // save handler
  $('#focusmanga_enabled').click(function() {
    localStorage['focusmanga_enabled'] = this.checked;
  });
  $('#timer_enabled').click(function() {
    localStorage['timer_enabled'] = this.checked;
  });
  $('#timer_delay').keyup(function() {
    localStorage['timer_delay'] = $(this).val();
  });
});
