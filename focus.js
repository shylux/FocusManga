// overlay html
var overlay = $('\
  <div id="focusmanga_overlay">\
    <div id="focusmanga_close">X</div>\
    <img />\
  </div>');

var w, h;
$(function() {
  // init
  $('body').prepend(overlay);

  $('img', overlay).load(function() {
    w = this.width;
    h = this.height;
    $(window).resize();
  });

  $('img', overlay).attr('src', $('#mainImg').attr('src'));
  $(window).resize(function() {
    if ($(window).width() < w) {
      $('img', overlay).addClass('landscape');
    } else {
      $('img', overlay).removeClass('landscape');
    }
  });

  // close overlay
  $('#focusmanga_close').click(function() {
    overlay.addClass('focusmanga_disabled');
  });
});
