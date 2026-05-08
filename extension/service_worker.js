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
    if (request.method === 'translate') {
        const blobToDataUrl = (blob) => new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
        (async () => {
            try {
                const imgBlob = await fetch(request.url).then(r => r.blob());
                const b64 = await blobToDataUrl(imgBlob);
                const res = await fetch('http://localhost:8000/translate', {
                    method: 'POST',
                    headers: {'Content-Type': 'text/plain'},
                    body: b64,
                });
                if (!res.ok) throw new Error(`Server error: ${res.status}: ${await res.text()}`);
                const dataUrl = await blobToDataUrl(await res.blob());
                sendResponse({dataUrl});
            } catch(err) {
                sendResponse({error: err.message});
            }
        })();
        return true; // keep message channel open for async response
    }

    OptionStorage.getInstance().then((options) => {
      console.log("request with method: "+request.method);

      if (request.method === "download") {
        const base64Data = request.data.base64Data;
        // Remove the prefix ("data:image/png;base64,")
        const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, "");
        const bytes = Uint8Array.from(atob(cleanBase64), c => c.charCodeAt(0));
        const blob = new Blob([bytes], { type: "image/png" });
        const reader = new FileReader();
        reader.onloadend = () => {
          const base64Data = reader.result; // e.g. "data:image/png;base64,AAA..."
          chrome.downloads.download({
            url: base64Data,
            filename: request.data.filename,
          });
          if (downloadId !== undefined &&
            request['chapter'] !== undefined &&
            showJobs[request.chapter] === undefined) {
            showJobs[request.chapter] = downloadId;
          } else {
            downloadJobs[downloadId] = request.erase;
          }
          sendResponse(downloadId);
        };
        reader.readAsDataURL(blob);
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