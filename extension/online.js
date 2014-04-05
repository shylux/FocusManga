// handle focusmanga
var hoster = getHoster();

FocusManga.isMangaPage = function() {return hoster.isMangaPage();}
FocusManga.hasNextPage = function() {return hoster.nextUrl;}
FocusManga.next = function() {console.log("next");window.location.href = hoster.nextUrl();}
FocusManga.setImage = function() {$('#fm_main', FocusManga.overlay).attr('src', hoster.imgUrl());}
FocusManga.getFileName = function() {return hoster.imgUrl().replace(/^.*[\\\/]/, '');}
if (hoster.collectionName) {
  FocusManga.getCollectionName = hoster.collectionName;
}
FocusManga.currentPageNumber = function() {return hoster.currPage();}
FocusManga.currentChapterPages = function() {return hoster.totalPages();}
FocusManga.preload = function() {
    $('head').append(
        $('<link rel="prerender" />').attr('src', hoster.nextUrl())
    );
}
