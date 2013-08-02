// overlay html
var overlay = $('\
  <div id="fm_overlay">\
    <img id="fm_close" />\
    <img id="fm_main" />\
    <div id="fm_tools">\
      <img id="fm_play">\
    </div>\
  </div>');
$('#fm_close', overlay).attr('src', chrome.extension.getURL('img/close-circle.png'));
$('#fm_play', overlay).attr('src', chrome.extension.getURL('img/play.png'));

var w, h, timer;
$('body').ready(function() {
  // init
  $('body').prepend(overlay);

  // calc img size
  $('#fm_main', overlay).load(function() {
    w = this.width;
    h = this.height;
    $(window).resize();
  });

  $('#fm_main', overlay).attr('src', $('#mainImg').attr('src'));
  // resize main img
  $(window).resize(function() {
    console.log("window: "+$(window).width()+", img: "+w);
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
        break;
      case 37: // arrow left
        break;
      case 27: // escape
        overlay.addClass('fm_disabled');
        break;
      default:
        console.log('pressed kay: '+e.keyCode);
    }
  });

  // timer
  if (typeof(localStorage['timer_state']) == 'undefined') localStorage['timer_state'] = false;
  timer = $.timer(function() {
    $('.next').click();
  }, 3000, (localStorage['timer_state']=='true'));

  //timer.set({time: 3000, autostart: start});
  updateTimerIcon();
  $('#fm_play').click(function() {
    if (timer.isActive) {
      localStorage['timer_state'] = false;
      timer.stop();
    } else {
      localStorage['timer_state'] = true;
      timer.once(0);
    }
    updateTimerIcon();
  });
  

  // preload next page (doesn't work atm. Chrome 30.0.1581.2 dev-m)
  $('head').append(
      $('<link rel="prerender" />').attr('src', $('.next').parent().attr('href'))
  );
});

function updateTimerIcon() {
  if ((localStorage['timer_state']=='true')) {
    $('#fm_play', overlay).attr('src', chrome.extension.getURL('img/stop.png'));
  } else {
    $('#fm_play', overlay).attr('src', chrome.extension.getURL('img/play.png'));
  }
}
