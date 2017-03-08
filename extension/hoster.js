var hoster_list = [];

var sample_hoster = {
  /* check for hostname is currUrl.contains(hostname) */
  hostname: "example.com",
  /* is the majority of the content targetet to  customers */
  mature: false,
  /* checks if page contains manga. returns true/false */
  mangaPageSelector: "#a .selector",
  /* parses the page and gets the url of the manga img */
  img: function() {return "img.png";},
  /* A relative manga page on the hoster to test
   * if the FocusManga code still works on the respective site */
  examplePage: "/mangas/one-piece/233/3",
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
  mangaPageSelector: '#img',
  img: function() {return $('#img');},
  nextUrl: function() {return $('.next a').attr('href');},
  currPage: function() {return parseInt($('#pageMenu option:selected').text());},
  totalPages: function() {return parseInt($('#pageMenu option:last').text());},
  collectionName: function() {var s = $('#mangainfo .c2 a').text(); return s.substr(0,s.length-6);},
  examplePage: "/113-4017-4/death-note/chapter-1.html"
};
hoster_list.push(mangapanda);

function tubeCollectionBase() {
  var line = $('#top h3').text().trim();
  return line.substr($('#top h3 a').text().length + " Manga ".length);
}

var onepiecetube = {
  hostname: "onepiece-tube.com",
  mature: false,
  mangaPageSelector: '#p',
  img: function() {return $('#p');},
  nextUrl: function() {return $('#p').parent().attr('href');},
  currPage: function() {return parseInt($('#controls a.active').text());},
  totalPages: function() {return parseInt($('#controls a').size())-2;},
  collectionName: function() {return "One Piece "+tubeCollectionBase()},
  examplePage: "/artbook/001/2"
};
hoster_list.push(onepiecetube);

var narutotube = $.extend(true, {}, onepiecetube);
narutotube.hostname = "naruto-tube.org";
narutotube.collectionName = function() {return "Naruto "+tubeCollectionBase()};
narutotube.examplePage = "/artbook/003/2";
hoster_list.push(narutotube);

var fairytailtube = $.extend(true, {}, onepiecetube);
fairytailtube.hostname = "fairytail-tube.org";
fairytailtube.collectionName = function() {return "Fairy Tail "+tubeCollectionBase()};
fairytailtube.examplePage = "/omake/001/3";
hoster_list.push(fairytailtube);

var mangahere = {
  hostname: "mangahere.co",
  mature: false,
  mangaPageSelector: '#image',
  img: function() {return $('#image');},
  nextUrl: function() {return $('.next_page').attr('href');},
  currPage: function() {return parseInt($('.wid60:first option:selected').text());},
  totalPages: function() {return parseInt($('.wid60 option:last').text());},
  collectionName: function() {return $('.title h1 a').text();},
  examplePage: "/manga/fairy_tail/v01/c001/4.html"
};
hoster_list.push(mangahere);

var batoto = {
  hostname: "bato.to",
  mature: false,
  mangaPageSelector: '#comic_page',
  img: function() {return $('#comic_page');},
  nextUrl: function() {return $("img[title='Next Page']").parent().attr('href');},
  currPage: function() {return parseInt($('#page_select')[0].selectedIndex+1);},
  totalPages: function() {return parseInt($('#page_select:first option').size());},
  collectionName: function() {return $('.moderation_bar li:first a').text();},
  examplePage: "/reader#cf2868f52e24ee4a_4"
};
hoster_list.push(batoto);

var mangafox = {
  hostname: "mangafox.me",
  mature: false,
  mangaPageSelector: '#image',
  img: function() {return $('#image');},
  nextUrl: function() {return $(".next_page").attr('href');},
  currPage: function() {return parseInt($('#top_bar .l .m option:selected').text());},
  totalPages: function() {return parseInt($('#top_bar .l .m option').size())-1;},
  collectionName: function() {return $('#series h1.no:first a').text();},
  examplePage: "/manga/horimiya/v03/c015/2.html"
};
hoster_list.push(mangafox);

var mangareader = {
  hostname: "mangareader.net",
  mature: false,
  mangaPageSelector: '#img',
  img: function() {return $('#img');},
  nextUrl: function() {return $(".next a").attr('href');},
  currPage: function() {return parseInt($('#pageMenu').find(':selected').text());},
  totalPages: function() {return $('#pageMenu option').size();},
  collectionName: function() {var s = $('#mangainfo .c2 a').text(); return s.substr(0,s.length-6);},
  examplePage: "/337-23513-2/historys-strongest-disciple-kenichi/chapter-7.html"
};
hoster_list.push(mangareader);

var goodmanga = {
  hostname: "goodmanga.net",
  mature: false,
  mangaPageSelector: '#manga_viewer img',
  img: function() {return $('#manga_viewer img');},
  nextUrl: function() {return $('.next_page').attr('href');},
  currPage: function() {return parseInt($('.page_select').find(':selected').text());},
  totalPages: function() {return $('.page_select:first option').size();},
  collectionName: function() {return $('#manga_head h3 a').text();},
  examplePage: "/rosario-vampire_ii/chapter/63/4"
};
hoster_list.push(goodmanga);

var mangastream = {
  hostname: "mangastream.com",
  mature: false,
  mangaPageSelector: '#manga-page',
  img: function() {return $('#manga-page');},
  nextUrl: function() {return $('#manga-page').parent().attr('href');},
  currPage: function() {return parseInt(window.location.pathname.split('/').slice(-1)[0]);},
  totalPages: function() {return parseInt(getLocation($('.controls .btn-reader-page li:last a').attr('href')).pathname.split('/').slice(-1)[0]);},
  examplePage: "/r/onepunch_man/065/3587/2"
};
hoster_list.push(mangastream);

var animea = {
  hostname: "manga.animea.net",
  mature: false,
  mangaPageSelector: '.scan .scanmr',
  img: function() {return $('.scan .scanmr');},
  nextUrl: function() {return $('.scan .scanmr').parent().attr('href');},
  currPage: function() {return parseInt($('.pageselect').find(':selected').val());},
  totalPages: function() {return $('.pageselect:first option').size();},
  collectionName: function() {return $('#content h1 > a').text();},
  examplePage: "/umi-no-misaki-chapter-120-page-3.html"
};
hoster_list.push(animea);

var mangaeden = {
  hostname: "mangaeden.com",
  mature: false,
  mangaPageSelector: '#mainImg',
  img: function() {return $('#mainImg');},
  nextUrl: function() {return $('.ui-state-default.next').attr('href');},
  currPage: function() {return parseInt($('.top-title select:last option:selected').text());},
  totalPages: function() {return $('.top-title select:last option').length},
  collectionName: function() {return $('.top-title a:last').text();},
  examplePage: "/en-manga/detective-conan/3/10/"
};
hoster_list.push(mangaeden);

var hbrowse = {
  hostname: "hbrowse.com",
  mature: true,
  mangaPageSelector: '.pageImage',
  img: function() {return $('.pageImage img');},
  nextUrl: function() {return $('.pageImage a').attr('href');},
  currPage: function() {return parseInt($('#jsPageList a:not([href])').text());},
  totalPages: function() {return $('#jsPageList a').length;},
  collectionName: function() {return $('#pageMain table tr:first td.listLong').text();},
  examplePage: "/14704/c00001/00006"
};
hoster_list.push(hbrowse);

var perveden = $.extend(true, {}, mangaeden);
perveden.hostname = "perveden.com";
perveden.mature = true;
perveden.examplePage = "/en-manga/my-sister/1/4/";
hoster_list.push(perveden);

var fakku = {
  hostname: "fakku.net",
  mature: true,
  mangaPageSelector: '.current-page:visible',
  img: function() {return $('.current-page:visible');},
  nextUrl: function() {return $('#image a').attr('href');},
  currPage: function() {return $('#content .page .drop:first option:selected').val();},
  totalPages: function() {return $('#content .page .drop:first option').length-1;},
  collectionName: function() {return $('.manga-title:first').text();}
};
hoster_list.push(fakku);

var mangatube = {
  hostname: "manga-tube.com",
  mature: false,
  mangaPageSelector: '#page',
  img: function() {return $('#page img');},
  nextUrl: function() {return $('#page a').attr('href');},
  currPage: function() {return parseInt($('.current_page').text());},
  totalPages: function() {return parseInt($('.topbar_right .tbtitle .text').text());},
  collectionName: function() {return $('.topbar_left .tbtitle.dropdown_parent:first a').text();},
  examplePage: "/reader/read/fairy_tail/de/0/474/page/1"
};
hoster_list.push(mangatube);

var e_hentai = {
  hostname: "e-hentai.org",
  mature: true,
  mangaPageSelector: '#img',
  img: function() {return $('#img');},
  nextUrl: function() {return $('#img').parent().attr('href');},
  currPage: function() {return parseInt($('#i2 div span:first').text());},
  totalPages: function() {return parseInt($('#i2 div span:last').text());},
  collectionName: function() {return $('h1').text();},
  examplePage: "/s/646e296355/691351-44"
};
hoster_list.push(e_hentai);

var senmanga = {
  hostname: "raw.senmanga.com",
  mature: false,
  mangaPageSelector: '#picture',
  img: function() {return $('#picture');},
  nextUrl: function() {return $('#picture').parent().attr('href');},
  currPage: function() {return parseInt($("select[name='page']:first option:selected").val());},
  totalPages: function() {return parseInt($('.pager:first').text().match('of (.*) Next')[1]);},
  collectionName: function() {return $('.walk:first a:nth-child(2)').text();},
  examplePage: "/Billionaire_Girl/12/4"
};
hoster_list.push(senmanga);

var nhentai = {
  hostname: "nhentai.net",
  mature: true,
  mangaPageSelector: '#image-container',
  img: function() {return $('#image-container a img');},
  nextUrl: function() {return $('#image-container a').attr('href');},
  currPage: function() {return parseInt($('.page-number .current:first').text());},
  totalPages: function() {return parseInt($('.page-number .num-pages:first').text());},
  collectionName: function() {return document.title.match("(.*) - Page .* » nhentai: hentai doujinshi and manga")[1];},
  examplePage: "/g/3/2/"
};
hoster_list.push(nhentai);

var hentaibox = {
  hostname: "hentaibox.net",
  mature: true,
  mangaPageSelector: 'body > center > table > tbody > tr:nth-child(2) > td > center > a > img',
  img: function() {return $('body > center > table > tbody > tr:nth-child(2) > td > center > a > img');},
  nextUrl: function() {return $('body > center > table > tbody > tr:nth-child(2) > td > center > a').attr('href');},
  currPage: function() {return parseInt($('.page-number .current:first').text());},
  totalPages: function() {return parseInt($('.page-number .num-pages:first').text());},
  collectionName: function() {return $('body > div:nth-child(5) > h2 > a:nth-child(3)').text();},
  examplePage: "/hentai-manga/20_23_Original_Kousei-Shisetsu/00"
};
hoster_list.push(hentaibox);


function getHoster(hoster_name, search_list) {
  if (search_list === undefined) search_list = hoster_list;
  if (hoster_name === undefined) hoster_name = window.location.hostname;
  for (var i in search_list) {
    if (hoster_name.indexOf(search_list[i].hostname) != -1)
      return search_list[i];
  }
}

// Utility
var getLocation = function(href) {
  var l = document.createElement("a");
  l.href = href;
  return l;
};
