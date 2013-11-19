var options = new OptionStorage();

// open options page on install
function install_notice() {
    time = options.get('install_time', false)
    if (time > 0)
        return;

    var now = new Date().getTime();
    options.set('install_time', now);
    chrome.tabs.create({url: "options.html"});
}
install_notice();


// listener
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    // get options from storage
    options.import(localStorage[options.key]);

    console.log("request with method: "+request.method);
    // update options with new data
    if (request.method == "options") {
	    options.import(request.data);
    }

    // display page action
    if (request.method == "pageAction") {
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

    sendResponse(options.export());
});

chrome.pageAction.onClicked.addListener(function(tab) {
    console.log("page action on tab "+tab.id);
    options.set("focusmanga_enabled", !options.get("focusmanga_enabled", true));
    chrome.tabs.sendMessage(tab.id, {method: "toggleFocusManga"}, function(response) {
	  console.log("ack from "+tab.id);
    });
});
