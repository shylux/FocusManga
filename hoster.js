var hoster_list = [];

var mangapanda = {
  hostname: "mangapanda.com",
  next: function() {$('.next a').click();},
  imgurl: function() {return $('#img').attr('src');},
  nexturl: function() {return $('.next a').attr('href');},
  ismanga: function() {return ($('#img').length > 0);}
}
hoster_list.push(mangapanda);

var onepiecetube = {
  hostname: "onepiece-tube.com",
  next: function() {window.location.href = this.nexturl()},
  imgurl: function() {return $('#p').attr('src');},
  nexturl: function() {return $('#controls a:last-child').attr('href');},
  ismanga: function() {return ($('#p').length > 0);},
}
hoster_list.push(onepiecetube);

var mangahere = {
  hostname: "mangahere.com",
  next: function() {window.location.href = $('.next_page').attr('href');},
  imgurl: function() {return $('#image').attr('src');},
  nexturl: function() {return $('.next_page').attr('href');},
  ismanga: function() {return ($('#image').length > 0);}
}
hoster_list.push(mangahere);

var batoto = {
  hostname: "batoto.net",
  next: function() {window.location.href = $("img[title='Next Page']").parent().attr('href');},
  imgurl: function() {return $('#comic_page').attr('src');},
  nexturl: function() {return $("img[title='Next Page']").parent().attr('href');},
  ismanga: function() {return ($('#comic_page').length > 0);}
}
hoster_list.push(batoto);

var mangafox = {
  hostname: "mangafox.me",
  next: function() {window.location.href = $(".next_page").attr('href');},
  imgurl: function() {return $('#image').attr('src');},
  nexturl: function() {return $(".next_page").attr('href');},
  ismanga: function() {return ($('#image').length > 0);}
}
hoster_list.push(mangafox);

var mangareader = {
  hostname: "mangareader.net",
  next: function() {window.location.href = $(".next a").attr('href');},
  imgurl: function() {return $('#img').attr('src');},
  nexturl: function() {return $(".next a").attr('href');},
  ismanga: function() {return ($('#img').length > 0);}
}
hoster_list.push(mangareader);

var mangainn = { /* timer no working */
  hostname: "mangainn.com",
  next: function() {},
  imgurl: function() {return $('#imgPage').attr('src');},
  nexturl: function() {return "";},
  ismanga: function() {return ($('#imgPage').length > 0);}
}
hoster_list.push(mangainn);

var goodmanga = {
  hostname: "goodmanga.net",
  next: function() {window.location.href = $('.next_page').attr('href');},
  imgurl: function() {return $('#manga_viewer img').attr('src');},
  nexturl: function() {return $('.next_page').attr('href');},
  ismanga: function() {return ($('#manga_viewer img').length > 0);}
}
hoster_list.push(goodmanga);

var mangastream = {
  hostname: "mangastream.to",
  next: function() {window.location.href = $('.manga-page').parent().attr('href');},
  imgurl: function() {return $('.manga-page').attr('src');},
  nexturl: function() {return $('.manga-page').parent().attr('href');},
  ismanga: function() {return ($('.manga-page').length > 0);}
}
hoster_list.push(mangastream);

var animea = {
  hostname: "manga.animea.net",
  next: function() {window.location.href = $('.mangaimg').parent().attr('href');},
  imgurl: function() {return $('.mangaimg').attr('src');},
  nexturl: function() {return $('.mangaimg').parent().attr('href');},
  ismanga: function() {return ($('.mangaimg').length > 0);}
}
hoster_list.push(animea);

var mangaeden = {
  hostname: "mangaeden.com",
  next: function() {window.location.href = $('.next').parent().attr('href');},
  imgurl: function() {return $('#mainImg').attr('src');},
  nexturl: function() {return $('.next').parent().attr('href');},
  ismanga: function() {return ($('#mainImg').length > 0);}
}
hoster_list.push(mangaeden);

var hbrowse = {
  hostname: "hbrowse.com",
  next: function() {window.location.href = $('.next').parent().attr('href');},
  imgurl: function() {return $('#mainImg').attr('src');},
  nexturl: function() {return $('.next').parent().attr('href');},
  ismanga: function() {return ($('#mainImg').length > 0);}
}
hoster_list.push(hbrowse);

var perveden = {
  hostname: "perveden.com",
  next: function() {$('.next').click();},
  imgurl: function() {return $('#mainImg').attr('src');},
  nexturl: function() {return $('.next').parent().attr('href');},
  ismanga: function() {return ($('#mainImg').length > 0);}
}
hoster_list.push(perveden);

var hname = window.location.hostname;

function getHoster() {
  for (i in hoster_list) {
    if (hname.indexOf(hoster_list[i].hostname) != -1)
      return hoster_list[i];
  }
}
