const hoster_list = [];

let sample_hoster = {
  /* check for hostname is currUrl.contains(hostname) */
  hostname: "example.com",
  /* is the majority of the content targetet to  customers */
  mature: false,
  /* alternative link to icon */
  icon: "http://static.example.com/favicon.ico",
  /* checks if page contains manga. returns true/false */
  mangaPageSelector: "#a .selector",
  /* alternative for mangaPageSelector which executes a function that returns a boolean */
  isMangaPage: function() {return true},
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
};

function tubeCollectionBase() {
  let line = $('#top h3').text().trim();
  return line.substr($('#top h3 a').text().length + " Manga ".length);
}

let onepiecetube = {
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

let narutotube = $.extend(true, {}, onepiecetube);
narutotube.hostname = "naruto-tube.org";
narutotube.collectionName = function() {return "Naruto "+tubeCollectionBase()};
narutotube.examplePage = "/artbook/003/2";
hoster_list.push(narutotube);

let fairytailtube = $.extend(true, {}, onepiecetube);
fairytailtube.hostname = "fairytail-tube.org";
fairytailtube.collectionName = function() {return "Fairy Tail "+tubeCollectionBase()};
fairytailtube.examplePage = "/omake/001/3";
fairytailtube.icon = "http://" + fairytailtube.hostname + "/templates/caprica/favicon.ico";
hoster_list.push(fairytailtube);

let mangahere = {
  hostname: "mangahere.cc",
  mature: false,
  mangaPageSelector: '.reader-main-img',
  img: function() {return $('.reader-main-img');},
  nextUrl: function() {return $('.pager-list-left:last span a:last').attr('href');},
  currPage: function() {return parseInt($('.pager-list-left:last span a.active').text());},
  totalPages: function() {return parseInt($('.pager-list-left:last span a').last().prev().text());},
  collectionName: function() {return $('.reader-header-title-2').text();},
  examplePage: "/manga/fairy_tail/v01/c001/4.html"
};
hoster_list.push(mangahere);

let batoto = {
  hostname: "bato.to",
  mature: false,
  icon: "http://static.bato.to/img/manga/favicon.gif",
  mangaPageSelector: '.nav-page',
  img: function() {return $('.page-img');},
  nextUrl: function() {return $(".nav-next a").attr('href');},
  currPage: function() {return parseInt($('.nav-page option:selected').val());},
  totalPages: function() {return parseInt($('.nav-page option').size());},
  collectionName: function() {return $('.nav-title a').text();},
  examplePage: "/chapter/1162733/6"
};
hoster_list.push(batoto);

let mangafox = {
  hostname: "fanfox.net",
  mature: false,
  mangaPageSelector: '.reader-main-img',
  img: function() {return $('.reader-main-img');},
  nextUrl: function() {return $('.pager-list-left:last span a:last').attr('href');},
  currPage: function() {return parseInt($('.pager-list-left:last span a.active').text());},
  totalPages: function() {return parseInt($('.pager-list-left:last span a').last().prev().text());},
  collectionName: function() {return $('.reader-header-title-2').text();},
  examplePage: "/manga/horimiya/v03/c015/2.html"
};
hoster_list.push(mangafox);

let mangareader = {
  hostname: "mangareader.cc",
  mature: false,
  icon: "http://mangareader.cc/frontend/imgs/favicon16.png",
  mangaPageSelector: '.chapter-content-inner img',
  img: function() {return $('.chapter-content-inner img');},
  nextUrl: function() {
    let nextIndex = $('#page_select').prop('selectedIndex')+2;
    if (nextIndex <= $('#page_select option').length) {
        return window.location.pathname + '#' + ($('#page_select').prop('selectedIndex')+2);
    } else if ($('#chapter option:selected').prev().length) {
        return $('#chapter option:selected').prev().val();
    } else {
        return $('h2.chapter-title a:first').attr('href');
    }
  },
  currPage: function() {return $('#page_select').prop('selectedIndex')+1;},
  totalPages: function() {return $('#page_select option').length;},
  collectionName: function() {return $('h1.chapter-title').text()},
  examplePage: "/chapter/martial-peak-chapter-1109#3"
};
hoster_list.push(mangareader);

let mangaeden = {
  hostname: "mangaeden.com",
  mature: false,
  mangaPageSelector: '#mainImg',
  img: function() {return $('#mainImg');},
  nextUrl: function() {return $('.ui-state-default.next').attr('href');},
  currPage: function() {return parseInt($('.top-title select:last option:selected').text());},
  totalPages: function() {return $('.top-title select:last option').length},
  collectionName: function() {return $('.top-title a:last').text();},
  examplePage: "/en/en-manga/bleach/686/3/"
};
hoster_list.push(mangaeden);

let hbrowse = {
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

let perveden = $.extend(true, {}, mangaeden);
perveden.hostname = "perveden.com";
perveden.mature = true;
perveden.examplePage = "/en/en-manga/cartoonists-nsfw-season-1-chapter-1-10-english/1/3/";
hoster_list.push(perveden);

let fakku = {
  hostname: "fakku.net",
  mature: true,
  mangaPageSelector: '.current-page:visible',
  img: function() {return $('.current-page:visible');},
  nextUrl: function() {return $('#image a').attr('href');},
  currPage: function() {return $('#content .page .drop:first option:selected').val();},
  totalPages: function() {return $('#content .page .drop:first option').length-1;},
  collectionName: function() {return $('.manga-title:first').text();},
  examplePage: "/" // sorry i don't have an account
};
hoster_list.push(fakku);

let mangatube = {
  hostname: "manga-tube.me",
  mature: false,
  icon: "https://manga-tube.me/assets/img/favicon.ico",
  mangaPageSelector: '.reader-body',
  img: function() {return $('.reader-body img');},
  nextUrl: function() {return $('.reader-navigation .page-dropdown li.active').next().find('a').attr('href');},
  currPage: function() {return parseInt($('.reader-navigation .page-dropdown li.active').data('page'));},
  totalPages: function() {return parseInt($('.reader-navigation .page-dropdown li').length);},
  collectionName: function() {return $('.reader-navigation .series-control .leave-reader').text();},
  examplePage: "/series/boruto__naruto_next_generations/read/11279/3"
};
hoster_list.push(mangatube);

let e_hentai = {
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

let exhentai = $.extend(true, {}, e_hentai);
exhentai.hostname = "exhentai.org";
exhentai.mature = true;
exhentai.examplePage = "/s/a11714cc16/1590156-1";
hoster_list.push(exhentai);

let senmanga = {
  hostname: "raw.senmanga.com",
  mature: false,
  mangaPageSelector: '#picture',
  img: function() {return $('#picture');},
  nextUrl: function() {return $('#picture').parent().attr('href');},
  currPage: function() {return parseInt($("select[name='page']:first option:selected").val());},
  totalPages: function() {return parseInt($('.pager:last').text().match('of (.*)')[1]);},
  collectionName: function() {return $('.location .walk:first a:nth-child(4)').text();},
  examplePage: "/Billionaire_Girl/12/4"
};
hoster_list.push(senmanga);

let nhentai = {
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

let mangapark = {
  hostname: "mangapark.net",
  mature: false,
  mangaPageSelector: '#img-1',
  img: function() {return $('#img-1');},
  nextUrl: function() {return $('.switch .page span:last a').attr('href');},
  currPage: function() {return parseInt($('#sel_page_1 :selected').text());},
  totalPages: function() {return $('#sel_page_1 option').length;},
  collectionName: function() {return $('.loc:first a').text();},
  examplePage: "/manga/twin-milf/i2380396/v2/c8.6/1"
};
hoster_list.push(mangapark);

// let pururin = {
//   hostname: "pururin.io",
//   mature: true,
//   icon: "https://pururin.io/assets/images/favicon.ico",
//   isMangaPage: function() {
//     return ($('.image-viewer .images-inline').length === 0);
//   },
//   img: function() {return $('.image-viewer img');},
//   nextUrl: function() {
//     let newPage = parseInt(/\/read\/\d+\/(\d+)\/.*/g.exec(window.location.pathname)[1]) + 1;
//     return window.location.toString().replace(/(\/read\/\d+\/)(\d+)/g, "$1"+pad(newPage, 2));
//   },
//   currPage: function() {return parseInt($('.image-meta select option:selected').text());},
//   totalPages: function() {return $('.image-meta select option').length;},
//   collectionName: function() {return $('.title').text();},
//   examplePage: "/read/35815/1/horny-androids"
// };
// hoster_list.push(pururin);

// let luscious = {
//   hostname: "luscious.net",
//   mature: true,
//   mangaPageSelector: '#single_picture',
//   img: function() {return $('#single_picture');},
//   nextUrl: function() {return $('#next').attr('href');},
//   currPage: function() {return parseInt($('#pj_page_no').val());},
//   totalPages: function() {return parseInt($('#pj_no_pictures').text());},
//   collectionName: function() {return $('.three_column_details h3 a').text()},
//   examplePage: "/pictures/album/csp5-kabayakiya-unagimaru-pet-bakuman-english-rookie84_164675/sorted/position/id/8942515/@_0002"
// };
// hoster_list.push(luscious);

function getHoster(hoster_name, search_list) {
  if (search_list === undefined) search_list = hoster_list;
  if (hoster_name === undefined) hoster_name = window.location.hostname;
  for (var i in search_list) {
    if (hoster_name.indexOf(search_list[i].hostname) !== -1)
      return search_list[i];
  }
}

// Utility
let getLocation = function(href) {
  let l = document.createElement("a");
  l.href = href;
  return l;
};
