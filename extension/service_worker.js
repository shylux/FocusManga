importScripts("version.js", "option_storage.js");

const downloadJobs = {};
const showJobs = {};

OptionStorage.getInstance().then((options) => {
  // open options page on install and update
  const installed_version = new Version(options.get('version', "0.0.0"));

  const package_version = new Version(chrome.runtime.getManifest().version);
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
});

// listener
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    OptionStorage.getInstance().then((options) => {
      console.log("request with method: "+request.method);

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
      if (request.method === "tabs") {
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

    sendResponse();
});

chrome.downloads.onChanged.addListener(function(downloadDelta) {
    OptionStorage.getInstance().then((options) => {
      if (downloadJobs[downloadDelta.id] !== undefined &&
          downloadDelta['state'] !== undefined &&
          downloadDelta['state'].current === "complete") {
          setTimeout(function() {
            chrome.downloads.erase({id: downloadDelta.id});
          }, downloadJobs[downloadDelta.id]);
      }
    });
});

chrome.action.onClicked.addListener(function(tab) {
    OptionStorage.getInstance().then((options) => {
      console.log("page action on tab "+tab.id);
      options.set("focusmanga-enabled", !options.get("focusmanga-enabled", true));
      chrome.tabs.sendMessage(tab.id, {method: "toggleFocusManga"});
    });
});