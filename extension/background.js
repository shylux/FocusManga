const options = new OptionStorage();
const downloadJobs = {};
const showJobs = {};

// open options page on install and update
const installed_version = new Version(options.get('version', "0.0.0"));

const package_version = new Version(chrome.app.getDetails().version);
package_version.patch = 0; // ignore patches
if (package_version.isNewerThan(installed_version) &&
    options.get('version_on_update', true)) {
    // check if first install
    if (!options.hasKey('version')) {
      chrome.tabs.create({url: "options.html"});
    }
    // update version
    options.set('version', package_version);
}

// listener
chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    // get options from storage
    options.import(localStorage[options.key]);

    console.log("request with method: "+request.method);
    // update options with new data
    if (request.method === "options") {
      if (request['timer-delay'] !== undefined) {
          options.set('timer-delay', request['timer-delay']);
      }
      if (request['force-display-collection'] !== undefined) {
          options.set('force-display-collection', request['force-display-collection']);
      }
      if (request['force-display-mode'] !== undefined) {
          options.set('force-display-mode', request['force-display-mode']);
      }
      options.import(request.data);
      sendResponse(options.export());
    }

    if (request.method === "download") {
      chrome.downloads.download(
          request.data,
          function(downloadId) {
              if (downloadId !== undefined &&
                  request['chapter'] !== undefined &&
                  showJobs[request.chapter] === undefined)
                  showJobs[request.chapter] = downloadId;
              else
                downloadJobs[downloadId] = request.erase;
              sendResponse(downloadId);
          }
      );
    }
    if (request.method === "show") {
      if (showJobs[request.data] !== undefined) {
        chrome.downloads.show(showJobs[request.data]);
        chrome.downloads.erase({id: showJobs[request.data]});
      }
    }

    // display page action
    if (request.method === "pageAction") {
      chrome.pageAction.show(sender.tab.id);
    } else if (request.method === "tabs") {
	    var optionsUrl = chrome.runtime.getURL('options.html');
	    chrome.tabs.query({url: optionsUrl}, function(tabs) {
	      if (tabs.length) {
		      chrome.tabs.update(tabs[0].id, {active: true});
	      } else {
		      chrome.tabs.create({url: optionsUrl});
	      }
	    });
    }
});

chrome.downloads.onChanged.addListener(function(downloadDelta) {
    if (downloadJobs[downloadDelta.id] !== undefined &&
        downloadDelta['state'] !== undefined &&
        downloadDelta['state'].current === "complete") {
        setTimeout(function() {
          chrome.downloads.erase({id: downloadDelta.id});
        }, downloadJobs[downloadDelta.id]);
    }
});

chrome.pageAction.onClicked.addListener(function(tab) {
    console.log("page action on tab "+tab.id);
    if (tab.url.startsWith("chrome-extension")) {
      chrome.windows.update(tab.windowId, { state: "fullscreen" });
    } else {
      options.set("focusmanga-enabled", !options.get("focusmanga-enabled", true));
      chrome.tabs.sendMessage(tab.id, {method: "toggleFocusManga"}, function(response) {});
    }
});
