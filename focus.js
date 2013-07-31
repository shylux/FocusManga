// overlay html
var overlay = $('\
  <div id="focusmanga_overlay">\
    <div id="focusmanga_close">X</div>\
    <img />\
  </div>');


$(function() {
  // init
  $('body').prepend(overlay);

  // close overlay
  $('#focusmanga_close').click(function() {
    overlay.addClass('focusmanga_disabled');
  });
});
