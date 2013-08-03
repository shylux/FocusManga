var perveden = {}
perveden.next = function() {$('.next').click();};
perveden.previous = function() {$('.prev').click();};
perveden.imgurl = function() {return $('#mainImg').attr('src');};
perveden.nexturl = function() {return $('.next').parent().attr('href');};
perveden.ismanga = function() {return ($('#mainImg').length > 0);};

var mangapanda = {}
mangapanda.next = function() {$('.next a').click();};
mangapanda.previous = function() {$('.prev a').click();};
mangapanda.imgurl = function() {return $('#img').attr('src');};
mangapanda.nexturl = function() {return $('.next a').attr('href');};
mangapanda.ismanga = function() {return ($('#img').length > 0);};

var hname = window.location.hostname;
var hoster;

if (hname == "www.mangapanda.com") {
  hoster = mangapanda;
} else if (hname == "www.perveden.com") {
  hoster = perveden;
}


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
    overlay.addClass('fm_disabled');
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
        overlay.addClass('fm_disabled');
        break;
    }
  });

  // timer
  chrome.extension.sendRequest({'method': 'options'}, function(response) {
    //console.log(response.timer_enabled+" "+response.timer_delay);
    timer = $.timer(function() {
      hoster.next();
    }, response.timer_delay, response.timer_enabled);
    updateTimerIcon();
  });

  // toggle timer/img
  $('#fm_play').click(function() {
    if (timer.isActive) {
      chrome.extension.sendRequest({'method': 'timer_enabled', 'data': false}, function(response) {});
      timer.stop();
    } else {
      // start timer
      chrome.extension.sendRequest({'method': 'timer_enabled', 'data': true}, function(response) {});
      timer.once(0);
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
