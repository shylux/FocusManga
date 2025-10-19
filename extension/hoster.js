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
  collectionName: function() {return "Bliz one RELOADED!";},
  /* optional
   * can be used when total pages is not available */
  isLastPageOfChapter: function() {return false;},
  /* optional
   * triggers when FocusManga is being enabled or disabled */
  onToggle: function(newState) {}
};

function tubeCollectionBase() {
  let line = $('#top h3').text().trim();
  return line.substr($('#top h3 a').text().length + " Manga ".length);
}

let onepiecetube = {
  hostname: "onepiece-tube.com",
  mature: false,
  mangaPageSelector: '#manga-container img',
  img: function() {return $('#manga-container img');},
  nextUrl: function() {return $('#nav .next a').attr('href');},
  currPage: function() {return parseInt($('#nav .active a').text());},
  totalPages: function() {return parseInt($('#nav .nav-pages .page-item').length);},
  collectionName: function() {return "One Piece "+$('#top .breadcrumb-item:last-child').text().trim()},
  examplePage: "/artbook/001/2"
};
hoster_list.push(onepiecetube);

let narutotube = {
  hostname: "naruto-tube.org",
  mangaPageSelector: '#p',
  img: function() {return $('#p');},
  nextUrl: function() {return $('#p').parent().attr('href');},
  currPage: function() {return parseInt($('#controls a.active').text());},
  totalPages: function() {return parseInt($('#controls a').length)-2;},
  collectionName: function() {return "Naruto "+tubeCollectionBase()},
  examplePage: "/artbook/003/2"
}
hoster_list.push(narutotube);

let fairytailtube = $.extend(true, {}, narutotube);
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
  icon: "https://bato.to/amsta/img/batoto/favicon.ico?v0",
  mangaPageSelector: '.page-img',
  img: function() {return $('.page-img');},
  nextUrl: function() {return $(".nav-next a").attr('href');},
  currPage: function() {return parseInt($('.nav-page option:selected').val());},
  totalPages: function() {return $('.nav-page option').length;},
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

// rip
//let mangaeden = {
//  hostname: "mangaeden.com",
//  mature: false,
//  mangaPageSelector: '#mainImg',
//  img: function() {return $('#mainImg');},
//  nextUrl: function() {return $('.ui-state-default.next').attr('href');},
//  currPage: function() {return parseInt($('.top-title select:last option:selected').text());},
//  totalPages: function() {return $('.top-title select:last option').length},
//  collectionName: function() {return $('.top-title a:last').text();},
//  examplePage: "/en/en-manga/bleach/686/3/"
//};
//hoster_list.push(mangaeden);

// rip
//let hbrowse = {
//  hostname: "hbrowse.com",
//  mature: true,
//  mangaPageSelector: '.pageImage',
//  img: function() {return $('.pageImage img');},
//  nextUrl: function() {return $('.pageImage a').attr('href');},
//  currPage: function() {return parseInt($('#jsPageList a:not([href])').text());},
//  totalPages: function() {return $('#jsPageList a').length;},
//  collectionName: function() {return $('#pageMain table tr:first td.listLong').text();},
//  examplePage: "/14704/c00001/00006"
//};
//hoster_list.push(hbrowse);

// rip
//let perveden = $.extend(true, {}, mangaeden);
//perveden.hostname = "perveden.com";
//perveden.mature = true;
//perveden.examplePage = "/en/en-manga/cartoonists-nsfw-season-1-chapter-1-10-english/1/3/";
//hoster_list.push(perveden);

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

// too complicated
//let mangapark = {
//  hostname: "mangapark.net",
//  mature: false,
//  icon: 'https://static.mangapark.net/img/favicon.ico',
//  mangaPageSelector: 'main img',
//  img: function() {return $('main img');},
//  nextUrl: function() {return $('.switch .page span:last a').attr('href');},
//  currPage: function() {return parseInt($('#sel_page_1 :selected').text());},
//  totalPages: function() {return $('#sel_page_1 option').length;},
//  collectionName: function() {return $('.loc:first a').text();},
//  examplePage: "/manga/twin-milf/i2380396/v2/c8.6/1"
//};
//hoster_list.push(mangapark);

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

 let luscious = {
   hostname: "luscious.net",
   mature: true,
   isMangaPage: function() {
     return window.location.href.indexOf('read') !== -1 && $('main picture img, main video').length != 0;
   },
   img: function() {return $('main picture img, main video');},
   onToggle: function(state) {
     if (state) {
       let params = new URLSearchParams(window.location.search);
       if (params.get('view') != 'slideshow') {
         params.set('view', 'slideshow');
         window.location = '?'+params.toString();
       }
     }
   },
   setImage: function() {
     if ($('main picture img').length) {
       let main = $('<img id="fm_main"/>');
       main.attr('src', hoster.img().attr('src'));
       $('#fm_main', FocusManga.overlay).replaceWith(main);
     }
     if ($('main video').length) {
       let video = hoster.img().clone();
       video.attr('id', 'fm_main');
       video.prop('muted', true);
       video.removeAttr('style');
       video.removeAttr('class');
       video.removeAttr('title');
       FocusManga.img_w = $('main video').width();
       FocusManga.img_h = $('main video').height();
       $('#fm_main', FocusManga.overlay).replaceWith(video);
       $('#fm_main', FocusManga.overlay).get(0).play();
     }
   },
   nextUrl: function() {
     let link = this.currUrl();
     link.searchParams.set('index', parseInt(link.searchParams.get('index')) + 1);
     return link.href;
   },
   currPage: function() {
     return parseInt(this.currUrl().searchParams.get('index')) + 1;
   },
   totalPages: function() {
     let total = 0;
     let matches = $('.album-info > .album-info:first').text().matchAll(/(\d+)/g);
     for (match of matches) {
        total += parseInt(match[0]);
     }
     return total;
   },
   collectionName: function() {return $('.album-heading a').text()},
   examplePage: "/albums/heavenly-ass_328997/",

   currUrl: function() {
     return new URL(window.location.href);
   },
 };
 hoster_list.push(luscious);

let hitomi = {
  hostname: "hitomi.la",
  mature: true,
  icon: 'https://ltn.hitomi.la/favicon-192x192.png',
  mangaPageSelector: '#comicImages picture',
  img: function() {return $('#comicImages img');},
  nextUrl: function() {return window.location.pathname + '#' + (parseInt($('#single-page-select').val())+1);},
  currPage: function() {return parseInt($('#single-page-select').val());},
  totalPages: function() {return $('#single-page-select option').length;},
  collectionName: function() {return $('title').text();},
  examplePage: "/reader/1903946.html#5"
};
hoster_list.push(hitomi);

let theduckwebcomics = {
  hostname: "theduckwebcomics.com",
  mature: false,
  mangaPageSelector: '.comic-page',
  img: function() {return $('.comic-page .comic-page__image img');},
  nextUrl: function() {return $('.comic-page__custom_nav img[alt="next page"]').parent().attr('href');},
  currPage: function() {
    let dropdown = $('.comic-page__nav select').get(0);
    return dropdown.length - dropdown.selectedIndex
  },
  totalPages: function() {return parseInt($('.comic-page__nav select option').length);},
  collectionName: function() {return "familiar BY SHOUSHIYO"},
  examplePage: "https://next.theduckwebcomics.com/Familiar/5747919/"
};
hoster_list.push(theduckwebcomics);

function getHoster(hoster_name, search_list) {
  if (search_list === undefined) search_list = hoster_list;
  if (hoster_name === undefined) hoster_name = window.location.hostname;
  for (var i in search_list) {
    if (hoster_name.indexOf(search_list[i].hostname) !== -1 ||
        search_list[i].hostname.indexOf(hoster_name) !== -1) {
        return search_list[i];
      }
  }
}

// Utility
let getLocation = function(href) {
  let l = document.createElement("a");
  l.href = href;
  return l;
};
