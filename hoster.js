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
  next: function() {window.location.href = $('#controls a:last').attr('href');},
  previous: function() {window.location.href = $('#controls a:first').attr('href');},
  imgurl: function() {return $('#p').attr('src');},
  nexturl: function() {return $('#controls a:last-child').attr('href');},
  ismanga: function() {return ($('#p').length > 0);},
}
hoster_list.push(onepiecetube);

var mangahere = {
  hostname: "www.mangahere.com",
  next: function() {window.location.href = $('.next_page').attr('href');},
  previous: function() {},
  imgurl: function() {return $('#image').attr('src');},
  nexturl: function() {return $('.next_page').attr('href');},
  ismanga: function() {return ($('#image').length > 0);}
}
hoster_list.push(mangahere);

var batoto = {
  hostname: "www.batoto.net",
  next: function() {window.location.href = $("img[title='Next Page']").parent().attr('href');},
  previous: function() {},
  imgurl: function() {return $('#comic_page').attr('src');},
  nexturl: function() {return $("img[title='Next Page']").parent().attr('href');},
  ismanga: function() {return ($('#comic_page').length > 0);}
}
hoster_list.push(batoto);

var mangafox = {
  hostname: "www.mangafox.me",
  next: function() {window.location.href = $(".next_page").attr('href');},
  previous: function() {},
  imgurl: function() {return $('#image').attr('src');},
  nexturl: function() {return $(".next_page").attr('href');},
  ismanga: function() {return ($('#image').length > 0);}
}
hoster_list.push(mangafox);

var mangareader = {
  hostname: "www.mangareader.net",
  next: function() {window.location.href = $(".next a").attr('href');},
  previous: function() {},
  imgurl: function() {return $('#img').attr('src');},
  nexturl: function() {return $(".next a").attr('href');},
  ismanga: function() {return ($('#img').length > 0);}
}
hoster_list.push(mangareader);

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
    if (hoster_list[i].hostname.endsWith(hname))
      return hoster_list[i];
  }
}
