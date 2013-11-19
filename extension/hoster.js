var hoster_list = [];

var sample_hoster = {
  /* check for hostname is currUrl.contains(hostname) */
  hostname: "example.com",
  /* checks if page contains manga. returns true/false */
  isMangaPage: function () {return true;},
  /* parses the page and gets the url of the manga img */
  imgUrl: function() {return "img.png";},
  /* optional
   * parses the page and gets the url of the next page.
   * if undefined disable timer */
  nextUrl: function() {return "http://next"},
  /* optional
   * parses the current page number starting at 1
   * used in combination with totalPages */
  currPage: function() {return 3;},
  /* optional
   * parses the number of pages of the chapter */
  totalPages: function() {return 20;}
}

var mangapanda = {
  hostname: "mangapanda.com",
  isMangaPage: function() {return ($('#img').length > 0);},
  imgUrl: function() {return $('#img').attr('src');},
  nextUrl: function() {return $('.next a').attr('href');},
  currPage: function() {return parseInt($('#pageMenu option:selected').text());},
  totalPages: function() {return parseInt($('#pageMenu option:last').text());}
}
hoster_list.push(mangapanda);

var onepiecetube = {
  hostname: "onepiece-tube.tv",
  isMangaPage: function() {return ($('#p').length > 0);},
  imgUrl: function() {return $('#p').attr('src');},
  nextUrl: function() {return $('#p').parent().attr('href');},
  currPage: function() {return parseInt($('#controls a.active').text());},
  totalPages: function() {return parseInt($('#controls a').size())-2;}
}
hoster_list.push(onepiecetube);

var narutotube = $.extend(true, {}, onepiecetube);
narutotube.hostname = "naruto-tube.com";
hoster_list.push(narutotube);

var fairytailtube = $.extend(true, {}, onepiecetube);
fairytailtube.hostname = "fairytail-tube.com";
hoster_list.push(fairytailtube);

var mangahere = {
  hostname: "mangahere.com",
  isMangaPage: function() {return ($('#image').length > 0);},
  imgUrl: function() {return $('#image').attr('src');},
  nextUrl: function() {return $('.next_page').attr('href');},
  currPage: function() {return parseInt($('.wid60:first option:selected').text());},
  totalPages: function() {return parseInt($('.wid60 option:last').text());}
}
hoster_list.push(mangahere);

var batoto = {
  hostname: "batoto.net",
  isMangaPage: function() {return ($('#comic_page').length > 0);},
  imgUrl: function() {return $('#comic_page').attr('src');},
  nextUrl: function() {return $("img[title='Next Page']").parent().attr('href');},
  currPage: function() {return parseInt($('#page_select')[0].selectedIndex+1);},
  totalPages: function() {return parseInt($('#page_select:first option').size());}
}
hoster_list.push(batoto);

var mangafox = {
  hostname: "mangafox.me",
  isMangaPage: function() {return ($('#image').length > 0);},
  imgUrl: function() {return $('#image').attr('src');},
  nextUrl: function() {return $(".next_page").attr('href');},
  currPage: function() {return parseInt($('#top_bar .l .m option:selected').text());},
  totalPages: function() {return parseInt($('#top_bar .l .m option').size())-1;}
}
hoster_list.push(mangafox);

var mangareader = {
  hostname: "mangareader.net",
  isMangaPage: function() {return ($('#img').length > 0);},
  imgUrl: function() {return $('#img').attr('src');},
  nextUrl: function() {return $(".next a").attr('href');},
  currPage: function() {return parseInt($('#pageMenu').find(':selected').text());},
  totalPages: function() {return $('#pageMenu option').size();}
}
hoster_list.push(mangareader);

var mangainn = { /* timer no working */
  hostname: "mangainn.com",
  isMangaPage: function() {return ($('#imgPage').length > 0);},
  imgUrl: function() {return $('#imgPage').attr('src');},
}
hoster_list.push(mangainn);

var goodmanga = {
  hostname: "goodmanga.net",
  isMangaPage: function() {return ($('#manga_viewer img').length > 0);},
  imgUrl: function() {return $('#manga_viewer img').attr('src');},
  nextUrl: function() {return $('.next_page').attr('href');},
  currPage: function() {return parseInt($('.page_select').find(':selected').text());},
  totalPages: function() {return $('.page_select:first option').size();}
}
hoster_list.push(goodmanga);

var mangastream = {
  hostname: "mangastream.to",
  isMangaPage: function() {return ($('.manga-page').length > 0);},
  imgUrl: function() {return $('.manga-page').attr('src');},
  nextUrl: function() {return $('.manga-page').parent().attr('href');},
  currPage: function() {return parseInt($('#id_page').find(':selected').val());},
  totalPages: function() {return $('#id_page option').size();}
}
hoster_list.push(mangastream);

var animea = {
  hostname: "manga.animea.net",
  isMangaPage: function() {return ($('.mangaimg').length > 0);},
  imgUrl: function() {return $('.mangaimg').attr('src');},
  nextUrl: function() {return $('.mangaimg').parent().attr('href');},
  currPage: function() {return parseInt($('.pageselect').find(':selected').val());},
  totalPages: function() {return $('.pageselect:first option').size();}
}
hoster_list.push(animea);

var mangaeden = {
  hostname: "mangaeden.com",
  isMangaPage: function() {return ($('#mainImg').length > 0);},
  imgUrl: function() {return $('#mainImg').attr('src');},
  nextUrl: function() {return $('.next').parent().attr('href');},
  currPage: function() {return parseInt($('.pagination .selected').text());},
  totalPages: function() {return $('.pagination a').length-2}
}
hoster_list.push(mangaeden);

var hbrowse = {
  hostname: "hbrowse.com",
  isMangaPage: function() {return ($('.pageImage').length > 0);},
  imgUrl: function() {return $('.pageImage img').attr('src');},
  nextUrl: function() {return $('.pageImage a').attr('href');},
  currPage: function() {return parseInt($('.pageList strong:last').text());},
  totalPages: function() {return parseInt($('.pageList a').size())+1;}
}
hoster_list.push(hbrowse);

var perveden = {
  hostname: "perveden.com",
  isMangaPage: function() {return ($('#mainImg').length > 0);},
  imgUrl: function() {return $('#mainImg').attr('src');},
  nextUrl: function() {return $('.next').parent().attr('href');},
  currPage: function() {return parseInt($('.pagination .selected').text());},
  totalPages: function() {return $('.pagination a').length-2}
}
hoster_list.push(perveden);

var fakku = {
  hostname: "fakku.net",
  isMangaPage: function() {return ($('.current-page').length > 0);},
  imgUrl: function() {return $('.current-page').attr('src');},
  nextUrl: function() {return $('#image a').attr('href');},
  currPage: function() {return $('.chapter .right .drop:first').val();},
  totalPages: function() {return parseInt($('.chapter .right .drop:first option').size())-1;}
}
hoster_list.push(fakku);

function getHoster(hoster_name, search_list) {
  if (search_list === undefined) search_list = hoster_list;
  if (hoster_name === undefined) hoster_name = window.location.hostname;
  for (i in search_list) {
    if (hoster_name.indexOf(search_list[i].hostname) != -1)
      return search_list[i];
  }
}

