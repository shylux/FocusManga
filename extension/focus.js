var hoster = getHoster();

// overlay html
var overlay = $('\
  <div id="fm_overlay">\
    <img id="fm_close" />\
    <a id="fm_imgnext">\
      <img id="fm_main" />\
    </a>\
    <span id="fm_info" />\
    <div id="fm_tools">\
      <img id="fm_play">\
      <img id="fm_options">\
    </div>\
  </div>');
$('#fm_close', overlay).attr('src', chrome.extension.getURL('img/close-circle.png'));
$('#fm_options', overlay).attr('src', chrome.extension.getURL('img/options.png'));

var w, h, timer;
$('body').ready(function() {
  $('body').show();
  // check if it really is a manga page
  if (!hoster.isMangaPage()) return;

  // check if timer is supported
  if (!hoster.nextUrl)
    $('#fm_tools', overlay).addClass('fm_disabled');

  // show page action
  chrome.extension.sendRequest({'method': 'pageAction'}, function(response) {});

  // add listener for page action message
  chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    $('html').toggleClass('fm_enabled');
  });

  // init
  $('body').prepend(overlay);

  // calc img size
  $('#fm_main', overlay).load(function() {
    w = this.width;
    h = this.height;
    $(window).resize();
  });

  $('#fm_main', overlay).attr('src', hoster.imgUrl());
  // resize main img
  $(window).resize(function() {
    if (w / h < $(window).width() / $(window).height()) {
      $('#fm_main', overlay).removeClass('landscape');
    } else {
      $('#fm_main', overlay).addClass('landscape');
    }
  });

  // close overlay
  $('#fm_close').click(function() {
    chrome.extension.sendRequest({'method': 'focusmanga_enabled', 'data': false}, function(response) {});
    $('html').removeClass('fm_enabled');
  });

  // keyboard bindings
  $(document).keydown(function(e) {
    switch (e.keyCode) {
      case 27: // escape
        $('html').removeClass('fm_enabled');
        chrome.extension.sendRequest({'method': 'focusmanga_enabled', 'data': false}, function(response) {});
        break;
    }
  });

  // timer
  chrome.extension.sendRequest({'method': 'options'}, function(response) {
    // check if focusmanga is active
    if (response.focusmanga_enabled) $('html').addClass('fm_enabled');
    if (hoster.nextUrl) {
      $('#fm_imgnext', overlay).attr('href', hoster.nextUrl());
      timer = $.timer(function() {
        if ($('.fm_enabled').length == 0) return;
        console.log('execute timer');
        window.location.href = hoster.nextUrl();
      }, response.timer_delay * 1000, response.timer_enabled);
      updateTimerIcon();
    }
  });

  // toggle timer/img
  $('#fm_play').click(function() {
    if (timer.isActive) {
      chrome.extension.sendRequest({'method': 'timer_enabled', 'data': false}, function(response) {});
      timer.stop();
      console.log('stopped timer');
    } else {
      // start timer
      chrome.extension.sendRequest({'method': 'timer_enabled', 'data': true}, function(response) {});
      timer.once(0);
      console.log('started timer');
    }
    updateTimerIcon();
  });

  // preload next page (doesn't work atm. Chrome 30.0.1581.2 dev-m)
  if (hoster.nextUrl)
    $('head').append(
        $('<link rel="prerender" />').attr('src', hoster.nextUrl())
    );

  // info - page number
      if(!isNaN(hoster.currPage()) && !isNaN(hoster.totalPages())) {
    $('#fm_info', overlay).show().text(hoster.currPage()+" / "+hoster.totalPages());
  }

  // options page
  $('#fm_options', overlay).click(function() {
    chrome.extension.sendRequest({'method': 'tabs'}, function(response) {});
  });
});

function updateTimerIcon() {
  chrome.extension.sendRequest({'method': 'options'}, function(response) {
    if (response.timer_enabled) {
      $('#fm_play', overlay).attr('src', chrome.extension.getURL('img/stop.png'));
    } else {
      $('#fm_play', overlay).attr('src', chrome.extension.getURL('img/play.png'));
    }
  });
}
