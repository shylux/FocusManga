// handle focusmanga
const hoster = getHoster();

if (hoster === undefined) throw new Error("No hoster found.");

FocusManga.isMangaPage = function() {
    if (hoster.mangaPageSelector) return $(hoster.mangaPageSelector).length > 0;
    if (hoster.isMangaPage) return hoster.isMangaPage();
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
let lastImg = hoster.img().get(0);
function checkImg() {
  let currImg = hoster.img().get(0);
  if (currImg !== lastImg ||
      $('#fm_main').attr('src') !== $(lastImg).attr('src')) {
    FocusManga.parsePage();
    lastImg = hoster.img().get(0);
  }
}
setInterval(checkImg, 100);
