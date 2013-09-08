$(function() {
  var options = new OptionStorage();
  // init values
  $('#focusmanga_enabled').prop('checked', options.get('focusmanga_enabled', true));
  $('#timer_enabled').prop('checked', options.get('timer_enabled', false));
  $('#timer_delay').val(options.get('timer_delay', 20));
  $('#page_numbers_enabled').prop('checked', options.get('page_numbers_enabled', true));
  $('#chapter_progressbar_enabled').prop('checked', options.get('chapter_progressbar_enabled', true));

  // save handler
  $('#focusmanga_enabled').click(function() {
    options.set('focusmanga_enabled', this.checked);
  });
  $('#timer_enabled').click(function() {
    options.set('timer_enabled', this.checked);
  });
  $('#timer_delay').keyup(function() {
    options.set('timer_delay', $(this).val());
  });
  $('#page_numbers_enabled').click(function() {
    options.set('page_numbers_enabled', this.checked);
  });
  $('#chapter_progressbar_enabled').click(function() {
    options.set('chapter_progressbar_enabled', this.checked);
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
