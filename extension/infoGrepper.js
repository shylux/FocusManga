hoster = getHoster();

function qualifyURL(url) {
  var a = document.createElement('a');
  a.href = url;
  return a.href;
}

if (hoster.isMangaPage)
  hoster.isMangaPage = hoster.isMangaPage();

if (hoster.imgUrl)
  hoster.imgUrl = qualifyURL(hoster.imgUrl());

if (hoster.nextUrl)
  hoster.nextUrl = qualifyURL(hoster.nextUrl());

if (hoster.currPage)
  hoster.currPage = hoster.currPage();

if (hoster.totalPages)
  hoster.totalPages = hoster.totalPages();

hoster;
