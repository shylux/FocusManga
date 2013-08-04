chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
  if (request.method == "timer_enabled") {
    localStorage['timer_enabled'] = request.data;
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

  var delay = (localStorage['timer_delay'] == 'undefined')? 10000: localStorage['timer_delay'];
  sendResponse({
    focusmanga_enabled: (localStorage['focusmanga_enabled']=='true'),
    timer_enabled: (localStorage['timer_enabled']=='true'),
    timer_delay: delay
  });
});

chrome.pageAction.onClicked.addListener(function(tab) {
  console.log("page action on tab "+tab.id);
  localStorage['focusmanga_enabled'] = !(localStorage['focusmanga_enabled']=='true');
  chrome.tabs.sendMessage(tab.id, {method: "toggleFocusManga"}, function(response) {
    console.log("ack from "+tab.id);
  });
});
