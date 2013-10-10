console.log("## Testing Script Start ##");

$(function() {
  template = $('.host').clone();
  $('.host').remove();

  for (i in tests) {
    console.log(">> Starting Test on %s", tests[i].hostname);
    chrome.tabs.create({
      active: false,
      url: tests[i].targetUrl,
    }, function(tab) {
        chrome.tabs.executeScript(tab.id, {file: "infoGrepper.js"}, function(arr_results) {
          chrome.tabs.remove(tab.id);
          var output = template.clone(true);

          if (chrome.runtime.lastError) {
            console.warn("  ! Execution error: %s", chrome.runtime.lastError);
            return;
          }
          if (!arr_results || !arr_results[0]) {
            console.warn("  ! Execution error: No return value.");
          }

          var results = arr_results[0];
          var testcase = getHoster(results.hostname, tests);

          $('.hostname', output).text(testcase.hostname);
          $('.targetUrl', output).append($('<a>[link]</a>').attr('href', testcase.targetUrl));

          /* parse results */

          // imgUrl
          $('.imgUrl', output).addClass(
            (testcase.imgUrl == results.imgUrl) ? 'pass': 'fail'
            );

          // nextUrl
          if (testcase.hasOwnProperty('nextUrl'))
            $('.nextUrl', output).addClass(
              (testcase.nextUrl == results.nextUrl) ? 'pass': 'fail'
              );
          else
            $('.nextUrl', output).addClass('not_implemented');

          // currPage
          if (testcase.hasOwnProperty('currPage'))
            $('.currPage', output).addClass(
              (testcase.currPage == results.currPage) ? 'pass': 'fail'
              );
          else
            $('.currPage', output).addClass('not_implemented');

          // totalPages
          if (testcase.hasOwnProperty('totalPages'))
            $('.totalPages', output).addClass(
              (testcase.totalPages == results.totalPages) ? 'pass': 'fail'
              );
          else
            $('.totalPages', output).addClass('not_implemented');

          // update status text
          $('.pass', output).text('Pass');
          $('.fail', output).text('Failed');
          $('.not_implemented', output).text('Not Implemented');

          console.log("<< Finishing Test on %s", testcase.hostname);
          if ($('.fail', output).size() > 0)
            $('#hosts').prepend(output);
          else
            $('#hosts').append(output);
        });
    });
  }
});
