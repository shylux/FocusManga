var hoster_list = [];

var mangapanda = {
  hostname: "www.mangapanda.com",
  next: function() {$('.next a').click();},
  previous: function() {$('.prev a').click();},
  imgurl: function() {return $('#img').attr('src');},
  nexturl: function() {return $('.next a').attr('href');},
  ismanga: function() {return ($('#img').length > 0);}
}
hoster_list.push(mangapanda);

var onepiecetube = {
  hostname: "www.onepiece-tube.com",
  next: function() {$('#controls a:last-child').click();},
  previous: function() {$('#controls a:first-child').click();},
  imgurl: function() {return $('#p').attr('src');},
  nexturl: function() {return $('#controls a:last-child').attr('href');},
  ismanga: function() {return ($('#p').length > 0);},
}
hoster_list.push(onepiecetube);

var perveden = {
  hostname: "www.perveden.com",
  next: function() {$('.next').click();},
  previous: function() {$('.prev').click();},
  imgurl: function() {return $('#mainImg').attr('src');},
  nexturl: function() {return $('.next').parent().attr('href');},
  ismanga: function() {return ($('#mainImg').length > 0);}
}
hoster_list.push(perveden);

var hname = window.location.hostname;

// endsWith
String.prototype.endsWith = function(suffix) {
  return this.indexOf(suffix, this.length - suffix.length) !== -1;
};

function getHoster() {
  for (i in hoster_list) {
    if (hoster_list[i].hostname.endsWith(hname)) return hoster_list[i];
  }
}
