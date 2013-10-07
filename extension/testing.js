console.log("## Testing Script Start ##");

tests = [
{
  hostname: "mangapanda.com",
  targetUrl: "http://www.mangapanda.com/113-4017-4/death-note/chapter-1.html",
  imgUrl: "http://i20.mangapanda.com/death-note/1/death-note-1563526.jpg",
  nextUrl: "http://www.mangapanda.com/113-4017-5/death-note/chapter-1.html",
  currPage: 4,
  totalPages: 50
},
{
  hostname: "onepiece-tube.tv",
  targetUrl: "http://onepiece-tube.tv/special/003/3",
  imgUrl: "http://onepiece-tube.tv/special/003/03.jpg",
  nextUrl: "http://onepiece-tube.tv/special/003/4",
  currPage: 3,
  totalPages: 175
}
];

$(function() {
  var template = $('.host').clone();
  $('.host').remove();

  for (i in tests) {
    var testcase = tests[i];
    var output = template.clone(true);

    console.log(">> Starting Test on %s", testcase.hostname);
    chrome.tabs.create({
      active: false,
      url: "http://www.mangapanda.com/113-4017-4/death-note/chapter-1.html",
    }, function(tab) {
        console.log("test");
        chrome.tabs.executeScript(tab.id, {file: "infoGrepper.js"}, function(arr_results) {
          if (chrome.runtime.lastError) {
            console.warn("  ! Execution error: %s", chrome.runtime.lastError);
            return;
          }
          if (!arr_results || !arr_results[0]) {
            console.warn("  ! Execution error: No return value.");
          }

          var results = arr_results[0];

          $('.hostname', output).text(testcase.hostname);

          // parse results
          $('.imgUrl', output).addClass(
            (testcase.imgUrl == results.imgUrl) ? 'pass': 'fail'
            );

          $('.nextUrl', output).addClass(
            (testcase.nextUrl == results.nextUrl) ? 'pass': 'fail'
            );

          if (testcase.hasOwnProperty('imgUrl'))
            $('.currPage', output).addClass(
              (testcase.currPage == results.currPage) ? 'pass': 'fail'
              );
          else
            $('.currPage', output).addClass('not_implemented');

          if (testcase.hasOwnProperty('imgUrl'))
            $('.totalPages', output).addClass(
              (testcase.totalPages == results.totalPages) ? 'pass': 'fail'
              );
          else
            $('.totalPages', output).addClass('not_implemented');

          chrome.tabs.remove(tab.id);
          console.log("<< Finishing Test on %s", testcase.hostname);
          $('#hosts').append(output);
        });
    });
  }
});
