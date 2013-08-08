$(function() {
  if (typeof(localStorage['timer_delay']) == 'undefined') localStorage['timer_delay'] = 20;
  if (typeof(localStorage['timer_enabled']) == 'undefined') localStorage['timer_enabled'] = true;
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

  for (i in hoster_list) {
    $('#hosters').append($('<a target="_blank">').attr('href', "http://"+hoster_list[i].hostname).text(hoster_list[i].hostname));
  }
});
