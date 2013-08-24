$(function() {
  if (typeof(localStorage['timer_delay']) == 'undefined') localStorage['timer_delay'] = 20;
  if (typeof(localStorage['timer_enabled']) == 'undefined') localStorage['timer_enabled'] = true;
  if (typeof(localStorage['page_numbers_enabled']) == 'undefined') localStorage['page_numbers_enabled'] = true;
  if (typeof(localStorage['chapter_progressbar_enabled']) == 'undefined') localStorage['chapter_progressbar_enabled'] = true;
  // init values
  $('#focusmanga_enabled').prop('checked', (localStorage['focusmanga_enabled']=='true'));
  $('#timer_enabled').prop('checked', (localStorage['timer_enabled']=='true'));
  $('#timer_delay').val(localStorage['timer_delay']);
  $('#page_numbers_enabled').prop('checked', (localStorage['page_numbers_enabled']=='true'));
  $('#chapter_progressbar_enabled').prop('checked', (localStorage['chapter_progressbar_enabled']=='true'));

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
  $('#page_numbers_enabled').click(function() {
    localStorage['page_numbers_enabled'] = this.checked;
  });
  $('#chapter_progressbar_enabled').click(function() {
    localStorage['chapter_progressbar_enabled'] = this.checked;
  });

  // list hoster
  var max_functions_count = 0;
  for (i in hoster_list) {
    $('#hosters').append($('<a target="_blank"></a>').attr('href', "http://"+hoster_list[i].hostname).text(hoster_list[i].hostname).prepend('<span>★</span>'));
    // put a star to the hosters with the most (all) functions
    var functions_count = 0;
    for (f in hoster_list[i]) functions_count++;
    if (functions_count > max_functions_count) {
      max_functions_count = functions_count;
      $('#hosters a span').hide();
      $('#hosters a span:last').show();
    } else if (functions_count < max_functions_count) {
      $('#hosters a span:last').hide();
    }
  }
});
