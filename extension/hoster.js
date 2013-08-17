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
  nextUrl: function() {return "http://next"}
}

var mangapanda = {
  hostname: "mangapanda.com",
  isMangaPage: function() {return ($('#img').length > 0);},
  imgUrl: function() {return $('#img').attr('src');},
  nextUrl: function() {return $('.next a').attr('href');}
}
hoster_list.push(mangapanda);

var onepiecetube = {
  hostname: "onepiece-tube.com",
  isMangaPage: function() {return ($('#p').length > 0);},
  imgUrl: function() {return $('#p').attr('src');},
  nextUrl: function() {return $('#p').parent().attr('href');},
}
hoster_list.push(onepiecetube);

var mangahere = {
  hostname: "mangahere.com",
  isMangaPage: function() {return ($('#image').length > 0);},
  imgUrl: function() {return $('#image').attr('src');},
  nextUrl: function() {return $('.next_page').attr('href');}
}
hoster_list.push(mangahere);

var batoto = {
  hostname: "batoto.net",
  isMangaPage: function() {return ($('#comic_page').length > 0);},
  imgUrl: function() {return $('#comic_page').attr('src');},
  nextUrl: function() {return $("img[title='Next Page']").parent().attr('href');}
}
hoster_list.push(batoto);

var mangafox = {
  hostname: "mangafox.me",
  isMangaPage: function() {return ($('#image').length > 0);},
  imgUrl: function() {return $('#image').attr('src');},
  nextUrl: function() {return $(".next_page").attr('href');}
}
hoster_list.push(mangafox);

var mangareader = {
  hostname: "mangareader.net",
  isMangaPage: function() {return ($('#img').length > 0);},
  imgUrl: function() {return $('#img').attr('src');},
  nextUrl: function() {return $(".next a").attr('href');}
}
hoster_list.push(mangareader);

var mangainn = { /* timer no working */
  hostname: "mangainn.com",
  isMangaPage: function() {return ($('#imgPage').length > 0);},
  imgurl: function() {return $('#imgPage').attr('src');},
  nexturl: function() {return "";}
}
hoster_list.push(mangainn);

var goodmanga = {
  hostname: "goodmanga.net",
  isMangaPage: function() {return ($('#manga_viewer img').length > 0);},
  imgUrl: function() {return $('#manga_viewer img').attr('src');},
  nextUrl: function() {return $('.next_page').attr('href');}
}
hoster_list.push(goodmanga);

var mangastream = {
  hostname: "mangastream.to",
  isMangaPage: function() {return ($('.manga-page').length > 0);},
  imgUrl: function() {return $('.manga-page').attr('src');},
  nextUrl: function() {return $('.manga-page').parent().attr('href');}
}
hoster_list.push(mangastream);

var animea = {
  hostname: "manga.animea.net",
  isMangaPage: function() {return ($('.mangaimg').length > 0);},
  imgUrl: function() {return $('.mangaimg').attr('src');},
  nextUrl: function() {return $('.mangaimg').parent().attr('href');}
}
hoster_list.push(animea);

var mangaeden = {
  hostname: "mangaeden.com",
  isMangaPage: function() {return ($('#mainImg').length > 0);},
  imgUrl: function() {return $('#mainImg').attr('src');},
  nextUrl: function() {return $('.next').parent().attr('href');}
}
hoster_list.push(mangaeden);

var hbrowse = {
  hostname: "hbrowse.com",
  isMangaPage: function() {return ($('.pageImage').length > 0);},
  imgUrl: function() {return $('.pageImage img').attr('src');},
  nextUrl: function() {return $('.pageImage a').attr('href');}
}
hoster_list.push(hbrowse);

var perveden = {
  hostname: "perveden.com",
  isMangaPage: function() {return ($('#mainImg').length > 0);},
  imgUrl: function() {return $('#mainImg').attr('src');},
  nextUrl: function() {return $('.next').parent().attr('href');}
}
hoster_list.push(perveden);

var hname = window.location.hostname;

function getHoster() {
  for (i in hoster_list) {
    if (hname.indexOf(hoster_list[i].hostname) != -1)
      return hoster_list[i];
  }
}
