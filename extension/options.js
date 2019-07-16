$(function() {
  var options = new OptionStorage();
  // init values
  $('#focusmanga_enabled').prop('checked', options.get('focusmanga_enabled', true));
  $('#timer_enabled').prop('checked', options.get('timer_enabled', false));
  $('#timer_delay').val(options.get('timer_delay', 20));
  $('#page_numbers_enabled').prop('checked', options.get('page_numbers_enabled', true));
  $('#chapter_progressbar_enabled').prop('checked', options.get('chapter_progressbar_enabled', true));
  $('#exif_rotation_correction_enabled').prop('checked', options.get('exif_rotation_correction_enabled', false));

  // save handler
  $('#focusmanga_enabled').click(function() {
    options.set('focusmanga_enabled', this.checked);
    $('#toast').show().text('Set FocusManga enabled: '+this.checked);
  });
  $('#timer_enabled').click(function() {
    options.set('timer_enabled', this.checked);
    $('#toast').show().text('Set timer enabled: '+this.checked);
  });
  $('#timer_delay').keyup(function() {
    options.set('timer_delay', $(this).val());
    $('#toast').show().text('Set timer delay to: '+$(this).val());
  });
  $('#page_numbers_enabled').click(function() {
    options.set('page_numbers_enabled', this.checked);
    $('#toast').show().text('Set show page numbers to: '+this.checked);
  });
  $('#chapter_progressbar_enabled').click(function() {
    options.set('chapter_progressbar_enabled', this.checked);
    $('#toast').show().text('Set show progressbar to: '+this.checked);
  });
  $('#exif_rotation_correction_enabled').click(function() {
    options.set('exif_rotation_correction_enabled', this.checked);
    $('#toast').show().text('Set exif image rotation correction to: '+this.checked);
  });

  // list hoster
  var max_functions_count = 0;
  for (var i in hoster_list) {
    var e = $('<a target="_blank"></a>').attr('href', "http://"+hoster_list[i].hostname).text(hoster_list[i].hostname);

    if (!hoster_list[i].mature) {
      $('#normal_content').append(e);
    } else {
      $('#adult_content .hosters').append(e);
    }
  }

  // open example site of each hoster
  $('#test_hoster').click(function() {
    for (var i in hoster_list) {
      var hoster = hoster_list[i];
      if (hoster.hasOwnProperty("examplePage"))
        chrome.tabs.create({url: 'http://'+hoster.hostname + hoster.examplePage});
    }
  });
});
