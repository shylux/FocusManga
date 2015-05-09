var hoster_list = [];

var sample_hoster = {
  /* check for hostname is currUrl.contains(hostname) */
  hostname: "example.com",
  /* is the majority of the content targetet to  customers */
  mature: false,
  /* checks if page contains manga. returns true/false */
  isMangaPage: function () {return true;},
  /* parses the page and gets the url of the manga img */
  img: function() {return "img.png";},
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
  totalPages: function() {return 20;},
  /* optional
   * returns the manga title. */
  collectionName: function() {return "Bliz one RELOADED!";}
}

var mangapanda = {
  hostname: "mangapanda.com",
  mature: false,
  isMangaPage: function() {return ($('#img').length > 0);},
  img: function() {return $('#img');},
  nextUrl: function() {return $('.next a').attr('href');},
  currPage: function() {return parseInt($('#pageMenu option:selected').text());},
  totalPages: function() {return parseInt($('#pageMenu option:last').text());},
  collectionName: function() {var s = $('#mangainfo .c2 a').text(); return s.substr(0,s.length-6);}
}
hoster_list.push(mangapanda);

function tubeCollectionBase() {
  var line = $('#top h3').text().trim();
  return line.substr($('#top h3 a').text().length + " Manga ".length);
}

var onepiecetube = {
  hostname: "onepiece-tube.com",
  mature: false,
  isMangaPage: function() {return ($('#p').length > 0);},
  img: function() {return $('#p');},
  nextUrl: function() {return $('#p').parent().attr('href');},
  currPage: function() {return parseInt($('#controls a.active').text());},
  totalPages: function() {return parseInt($('#controls a').size())-2;},
  collectionName: function() {return "One Piece "+tubeCollectionBase()}
}
hoster_list.push(onepiecetube);

var narutotube = $.extend(true, {}, onepiecetube);
narutotube.hostname = "naruto-tube.org";
narutotube.collectionName = function() {return "Naruto "+tubeCollectionBase()}
hoster_list.push(narutotube);

var fairytailtube = $.extend(true, {}, onepiecetube);
fairytailtube.hostname = "fairytail-tube.org";
fairytailtube.collectionName = function() {return "Fairy Tail "+tubeCollectionBase()}
hoster_list.push(fairytailtube);

var mangahere = {
  hostname: "mangahere.co",
  mature: false,
  isMangaPage: function() {return ($('#image').length > 0);},
  img: function() {return $('#image');},
  nextUrl: function() {return $('.next_page').attr('href');},
  currPage: function() {return parseInt($('.wid60:first option:selected').text());},
  totalPages: function() {return parseInt($('.wid60 option:last').text());},
  collectionName: function() {return $('.title h1 a').text();}
}
hoster_list.push(mangahere);

var batoto = {
  hostname: "bato.to",
  mature: false,
  isMangaPage: function() {return ($('#comic_page').length > 0);},
  img: function() {return $('#comic_page');},
  nextUrl: function() {return $("img[title='Next Page']").parent().attr('href');},
  currPage: function() {return parseInt($('#page_select')[0].selectedIndex+1);},
  totalPages: function() {return parseInt($('#page_select:first option').size());},
  collectionName: function() {return $('.moderation_bar li:first a').text();}
}
hoster_list.push(batoto);

var mangafox = {
  hostname: "mangafox.me",
  mature: false,
  isMangaPage: function() {return ($('#image').length > 0);},
  img: function() {return $('#image');},
  nextUrl: function() {return $(".next_page").attr('href');},
  currPage: function() {return parseInt($('#top_bar .l .m option:selected').text());},
  totalPages: function() {return parseInt($('#top_bar .l .m option').size())-1;},
  collectionName: function() {return $('#series h1.no:first a').text();}
}
hoster_list.push(mangafox);

var mangareader = {
  hostname: "mangareader.net",
  mature: false,
  isMangaPage: function() {return ($('#img').length > 0);},
  img: function() {return $('#img');},
  nextUrl: function() {return $(".next a").attr('href');},
  currPage: function() {return parseInt($('#pageMenu').find(':selected').text());},
  totalPages: function() {return $('#pageMenu option').size();},
  collectionName: function() {var s = $('#mangainfo .c2 a').text(); return s.substr(0,s.length-6);}
}
hoster_list.push(mangareader);

// var mangainn = { /* timer no working */
//   hostname: "mangainn.com",
//   mature: false,
//   isMangaPage: function() {return ($('#imgPage').length > 0);},
//   img: function() {return $('#imgPage');},
//   currPage: function() {return parseInt($('#cmbpages option:selected').val());},
//   totalPages: function() {return $('#cmbpages option').size();},
//   collectionName: function() {return $('#gotoMangaInfo').text();}
// }
// hoster_list.push(mangainn);

var goodmanga = {
  hostname: "goodmanga.net",
  mature: false,
  isMangaPage: function() {return ($('#manga_viewer img').length > 0);},
  img: function() {return $('#manga_viewer img');},
  nextUrl: function() {return $('.next_page').attr('href');},
  currPage: function() {return parseInt($('.page_select').find(':selected').text());},
  totalPages: function() {return $('.page_select:first option').size();},
  collectionName: function() {return $('#manga_head h3 a').text();}
}
hoster_list.push(goodmanga);

var mangastream = {
  hostname: "mangastream.to",
  mature: false,
  isMangaPage: function() {return ($('.manga-page').length > 0);},
  img: function() {return $('.manga-page');},
  nextUrl: function() {return $('.manga-page').parent().attr('href');},
  currPage: function() {return parseInt($('#id_page').find(':selected').val());},
  totalPages: function() {return $('#id_page option').size();}
}
hoster_list.push(mangastream);

var animea = {
  hostname: "manga.animea.net",
  mature: false,
  isMangaPage: function() {return ($('.mangaimg').length > 0);},
  img: function() {return $('.mangaimg');},
  nextUrl: function() {return $('.mangaimg').parent().attr('href');},
  currPage: function() {return parseInt($('.pageselect').find(':selected').val());},
  totalPages: function() {return $('.pageselect:first option').size();},
  collectionName: function() {return $('#content h1 > a').text();}
}
hoster_list.push(animea);

var mangaeden = {
  hostname: "mangaeden.com",
  mature: false,
  isMangaPage: function() {return ($('#mainImg').length > 0);},
  img: function() {return $('#mainImg');},
  nextUrl: function() {return $('.ui-state-default.next').attr('href');},
  currPage: function() {return parseInt($('.top-title select:last option:selected').text());},
  totalPages: function() {return $('.top-title select:last option').length},
  collectionName: function() {return $('.top-title a:last').text();}
}
hoster_list.push(mangaeden);

var hbrowse = {
  hostname: "hbrowse.com",
  mature: true,
  isMangaPage: function() {return ($('.pageImage').length > 0);},
  img: function() {return $('.pageImage img');},
  nextUrl: function() {return $('.pageImage a').attr('href');},
  currPage: function() {return parseInt($('#jsPageList a:not([href])').text());},
  totalPages: function() {return $('#jsPageList a').length;},
  collectionName: function() {return $('#pageMain table tr:first td.listLong').text();}
}
hoster_list.push(hbrowse);

var perveden = $.extend(true, {}, mangaeden);
perveden.hostname = "perveden.com";
perveden.mature = true;
hoster_list.push(perveden);

var fakku = {
  hostname: "fakku.net",
  mature: true,
  isMangaPage: function() {return ($('.current-page:visible').length > 0);},
  img: function() {return $('.current-page:visible');},
  nextUrl: function() {return $('#image a').attr('href');},
  currPage: function() {return $('#content .page .drop:first option:selected').val();},
  totalPages: function() {return $('#content .page .drop:first option').length-1;},
  collectionName: function() {return $('.manga-title:first').text();}
}
hoster_list.push(fakku);

var mangatube = {
  hostname: "manga-tube.org",
  mature: false,
  isMangaPage: function() {return ($('#page').length > 0);},
  img: function() {return $('#page img');},
  nextUrl: function() {return $('#page a').attr('href');},
  currPage: function() {return parseInt($('.current_page').text());},
  totalPages: function() {return parseInt($('.topbar_right .tbtitle .text').text());},
  collectionName: function() {return $('.topbar_left .tbtitle.dropdown_parent:first a').text();}
}
hoster_list.push(mangatube);

var e_hentai = {
  hostname: "e-hentai.org",
  mature: true,
  isMangaPage: function() {return ($('#img').length > 0);},
  img: function() {return $('#img');},
  nextUrl: function() {return $('#img').parent().attr('href');},
  currPage: function() {return parseInt($('#i2 div span:first').text());},
  totalPages: function() {return parseInt($('#i2 div span:last').text());},
  collectionName: function() {return $('h1').text();}
}
hoster_list.push(e_hentai);

var senmanga = {
  hostname: "raw.senmanga.com",
  mature: false,
  isMangaPage: function() {return ($('#picture').length > 0);},
  img: function() {return $('#picture');},
  nextUrl: function() {return $('#picture').parent().attr('href');},
  currPage: function() {return parseInt($("select[name='page']:first option:selected").val());},
  totalPages: function() {return parseInt($('.pager:first').text().match('of (.*) Next')[1]);},
  collectionName: function() {return $('.walk:first a:nth-child(2)').text();}
}
hoster_list.push(senmanga);


function getHoster(hoster_name, search_list) {
  if (search_list === undefined) search_list = hoster_list;
  if (hoster_name === undefined) hoster_name = window.location.hostname;
  for (i in search_list) {
    if (hoster_name.indexOf(search_list[i].hostname) != -1)
      return search_list[i];
  }
}
