
// default value
if (!localStorage['focusmanga_enabled']) localStorage['focusmanga_enabled'] = true;
if (!localStorage['timer_enabled']) localStorage['timer_enabled'] = false;
if (!localStorage['timer_delay']) localStorage['timer_delay'] = 20;
if (!localStorage['page_numbers_enabled']) localStorage['page_numbers_enabled'] = true;
if (!localStorage['chapter_progressbar_enabled']) localStorage['chapter_progressbar_enabled'] = true;

// listener
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  if (request.method == "timer_enabled") {
    localStorage['timer_enabled'] = request.data;
  } else if (request.method == "focusmanga_enabled") {
    localStorage['focusmanga_enabled'] = request.data;
  } else if (request.method == "pageAction") {
    chrome.pageAction.show(sender.tab.id);
  } else if (request.method == "tabs") {
    var optionsUrl = chrome.extension.getURL('options.html');
    chrome.tabs.query({url: optionsUrl}, function(tabs) {
      if (tabs.length) {
        chrome.tabs.update(tabs[0].id, {active: true});
      } else {
        chrome.tabs.create({url: optionsUrl});
      } 
    });
  }

  var config = {};
  config.timer_enabled = (localStorage['timer_enabled']=='true');
  config.page_numbers_enabled = (localStorage['page_numbers_enabled']=='true');
  config.chapter_progressbar_enabled = (localStorage['chapter_progressbar_enabled']=='true');
  config.timer_delay = localStorage['timer_delay'];
  config.focusmanga_enabled = (localStorage['focusmanga_enabled']=='true');

  sendResponse(config);
});

chrome.pageAction.onClicked.addListener(function(tab) {
  console.log("page action on tab "+tab.id);
  localStorage['focusmanga_enabled'] = !(localStorage['focusmanga_enabled']=='true');
  chrome.tabs.sendMessage(tab.id, {method: "toggleFocusManga"}, function(response) {
    console.log("ack from "+tab.id);
  });
});
