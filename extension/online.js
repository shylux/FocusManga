// handle focusmanga
var hoster = getHoster();

FocusManga.isMangaPage = function() {
  return $(hoster.mangaPageSelector).length > 0;
};
FocusManga.hasNextPage = function() {return hoster.nextUrl;};
FocusManga.next = function() {console.log("next");window.location.href = hoster.nextUrl();};
FocusManga.setImage = function() {$('#fm_main', FocusManga.overlay).attr('src', hoster.img().attr('src'));};
FocusManga.getFileName = function() {return hoster.img().attr('src').replace(/^.*[\\\/]/, '');};
if (hoster.collectionName) {
  FocusManga.getCollectionName = hoster.collectionName;
}
FocusManga.currentPageNumber = function() {return hoster.currPage();};
FocusManga.currentChapterPages = function() {return hoster.totalPages();};
FocusManga.preload = function() {
    $('head').append(
        $('<link rel="prerender" />').attr('src', hoster.nextUrl())
    );
};

/**
 * What has to be detected:
 * - Attribute src change in source page
 * - img element gets removed and readded with new source
 * A periodical check is the most reliable option.
 * jQuery events only trigger once, since the element gets readded.
 * The same problem exists with MutationObservers.
 *
 * Another approach was to observe the url.
 * But this failed because dom and url changes were out of sync.
 * The url was updated bevore the dom. (url update -> ajax request -> dom update)
 * Resulted in my script parsing the page before the dom got updated.
 */
var lastImg = hoster.img().get(0);
function checkImg() {
  if (hoster.img().get(0) != lastImg) {
    FocusManga.parsePage();
    lastImg = hoster.img().get(0);
  }
}
setInterval(checkImg, 100);
