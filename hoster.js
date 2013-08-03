var hoster_list = [];

var mangapanda = {
  hostname: "www.mangapanda.com",
  next: function() {$('.next a').click();},
  imgurl: function() {return $('#img').attr('src');},
  nexturl: function() {return $('.next a').attr('href');},
  ismanga: function() {return ($('#img').length > 0);}
}
hoster_list.push(mangapanda);

var onepiecetube = {
  hostname: "www.onepiece-tube.com",
  next: function() {window.location.href = this.nexturl()},
  imgurl: function() {return $('#p').attr('src');},
  nexturl: function() {return $('#controls a:last-child').attr('href');},
  ismanga: function() {return ($('#p').length > 0);},
}
hoster_list.push(onepiecetube);

var mangahere = {
  hostname: "www.mangahere.com",
  next: function() {window.location.href = $('.next_page').attr('href');},
  imgurl: function() {return $('#image').attr('src');},
  nexturl: function() {return $('.next_page').attr('href');},
  ismanga: function() {return ($('#image').length > 0);}
}
hoster_list.push(mangahere);

var batoto = {
  hostname: "www.batoto.net",
  next: function() {window.location.href = $("img[title='Next Page']").parent().attr('href');},
  imgurl: function() {return $('#comic_page').attr('src');},
  nexturl: function() {return $("img[title='Next Page']").parent().attr('href');},
  ismanga: function() {return ($('#comic_page').length > 0);}
}
hoster_list.push(batoto);

var mangafox = {
  hostname: "www.mangafox.me",
  next: function() {window.location.href = $(".next_page").attr('href');},
  imgurl: function() {return $('#image').attr('src');},
  nexturl: function() {return $(".next_page").attr('href');},
  ismanga: function() {return ($('#image').length > 0);}
}
hoster_list.push(mangafox);

var mangareader = {
  hostname: "www.mangareader.net",
  next: function() {window.location.href = $(".next a").attr('href');},
  imgurl: function() {return $('#img').attr('src');},
  nexturl: function() {return $(".next a").attr('href');},
  ismanga: function() {return ($('#img').length > 0);}
}
hoster_list.push(mangareader);

var mangainn = { /* timer no working */
  hostname: "www.mangainn.com",
  next: function() {},
  imgurl: function() {return $('#imgPage').attr('src');},
  nexturl: function() {return "";},
  ismanga: function() {return ($('#imgPage').length > 0);}
}
hoster_list.push(mangainn);

var goodmanga = {
  hostname: "www.goodmanga.net",
  next: function() {window.location.href = $('.next_page').attr('href');},
  imgurl: function() {return $('#manga_viewer img').attr('src');},
  nexturl: function() {return $('.next_page').attr('href');},
  ismanga: function() {return ($('#manga_viewer img').length > 0);}
}
hoster_list.push(goodmanga);

var hbrowse = {
  hostname: "www.hbrowse.com",
  next: function() {window.location.href = $("a.pageLink:contains('NEXT PAGE')").attr('href');},
  imgurl: function() {return $('.pageImage img').attr('src');},
  nexturl: function() {return $("a.pageLink:contains('NEXT PAGE')").attr('href');},
  ismanga: function() {return ($('.pageImage img').length > 0);}
}
hoster_list.push(hbrowse);

var perveden = {
  hostname: "www.perveden.com",
  next: function() {$('.next').click();},
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
