var hoster = getHoster();

// overlay html
var overlay = $('\
  <div id="fm_overlay">\
    <img id="fm_close" />\
    <img id="fm_main" />\
    <div id="fm_tools">\
      <img id="fm_play">\
      <img id="fm_options">\
    </div>\
  </div>');
$('#fm_close', overlay).attr('src', chrome.extension.getURL('img/close-circle.png'));
$('#fm_options', overlay).attr('src', chrome.extension.getURL('img/options.png'));

var w, h, timer;
$('body').ready(function() {
  // check if it really is a manga page
  if (!hoster.ismanga()) return;

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

  $('#fm_main', overlay).attr('src', hoster.imgurl());
  // resize main img
  $(window).resize(function() {
    if ($(window).width() < w) {
      $('#fm_main', overlay).addClass('landscape');
    } else {
      $('#fm_main', overlay).removeClass('landscape');
    }
  });

  // close overlay
  $('#fm_close').click(function() {
    $('html').removeClass('fm_enabled');
  });

  // keyboard bindings
  $(document).keydown(function(e) {
    switch (e.keyCode) {
      case 39: // arrow right
        hoster.next();
        break;
      case 37: // arrow left
        hoster.previous();
        break;
      case 27: // escape
        $('html').removeClass('fm_enabled');
        break;
    }
  });

  // timer
  chrome.extension.sendRequest({'method': 'options'}, function(response) {
    // check if focusmanga is active
    if (response.focusmanga_enabled) $('html').addClass('fm_enabled');
    //console.log(response.timer_enabled+" "+response.timer_delay);
    timer = $.timer(function() {
      if ($('.fm_enabled').length == 0) return;
      console.log('execute timer');
      hoster.next();
    }, response.timer_delay * 1000, response.timer_enabled);
    updateTimerIcon();
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
  $('head').append(
      $('<link rel="prerender" />').attr('src', hoster.nexturl())
  );

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
