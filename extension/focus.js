function cleanName(name) {
  return name.replace(/[^a-zA-Z0-9\- \[\]]/gi, ''); // Strip any special characters
}

FocusManga = new function() {
  this.title = "FocusManga";

  //// OVERRIDE ////
  this.hasNextPage = function() {return false;};
  this.setImage = function() {};
  this.getFileName = function() {};
  this.getCollectionName = function() {};
  this.currentPageNumber = function() {};
  this.currentChapterPages = function() {};
  this.preload = function() {};
  this.next = function() {};


  this.options = new OptionStorage();
  this.show_timer = $.timer({
    name: "Picture change timer.",
    delay: 20*1000,
    action: function() {
      if (FocusManga.isDisplaying()) FocusManga.next();
      else FocusManga.show_timer.restart();
    },
    onProgress: function(percentage) {
      if (FocusManga.options.get("chapter_progressbar_enabled", true))
        $('#fm_progress', FocusManga.overlay)
          .css('width', Math.round(percentage)+"%");
    }
  });
  this.mouse_timer = $.timer({
    name: "Mouse hide timer.",
    delay: 2000,
    action: function() {
      FocusManga.onMouseInactive();
    }
  });
  this.mouse_just_hidden = false;
  this.img_w;
  this.img_h;

  // overlay html
  this.overlay = $(`
    <div id="fm_overlay">
      <div id="fm_progress"></div>
      <img id="fm_close" title="Close" />
      <img id="fm_main" />
      <div id="fm_info">
        <span id="fm_numbers" />
        <span id="fm_name"></span>
      </div>
      <div id="fm_tools">
        <img id="fm_play" title="Play / Pause">
        <div id="fm_download_container">
          <span>
            <span id="fm_download_chap">Chapter</span>
          </span>
          <img id="fm_download" title="Download image">
        </div>
        <img id="fm_options" title="Settings">
      </div>
    </div>
  `);
  $('#fm_close', this.overlay).attr('src', chrome.extension.getURL('img/close-circle.png'));
  $('#fm_download', this.overlay).attr('src', chrome.extension.getURL('img/download.png'));
  $('#fm_options', this.overlay).attr('src', chrome.extension.getURL('img/options.png'));

  // setup everything
  $('body').ready(function() {FocusManga.onready();});
  this.onready = function() {
    $('body').show();
    FocusManga.parsePage();
    FocusManga.checkUrl();
  };

  this.lastUrl = window.location.href;
  this.checkUrl = function() {
    if (window.location.href != FocusManga.lastUrl) {
      FocusManga.parsePage();
      FocusManga.lastUrl = window.location.href;
    }
    setTimeout(FocusManga.checkUrl, 100);
  };

  this.setup = function() {
    // check if it really is a manga page
    if (!FocusManga.isMangaPage()) return;

    // show page action
    chrome.extension.sendRequest({'method': 'pageAction'}, function(response) {});

    // add overlay
    $('body').prepend(FocusManga.overlay);

    // check if timer is supported
    if (!FocusManga.hasNextPage())
      $('#fm_tools', FocusManga.overlay).addClass('fm_disabled');

    // add listener for page action message
    chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
      FocusManga.onPageAction();
    });

    // click for next page
    $('#fm_main', FocusManga.overlay).click(function() {
      if (FocusManga.hasNextPage) {
        FocusManga.next();
      }
    });

    // download click handler
    $('#fm_download', FocusManga.overlay).click(function() {
      FocusManga.download();
    });
    $('#fm_download_chap', FocusManga.overlay).click(function() {
      var currentChapters = FocusManga.options.get("chapter_dl", []);
      currentChapters.push(FocusManga.getCollectionName());
      FocusManga.options.set("chapter_dl", currentChapters);
      FocusManga.downloadChapter();
    });

    // add listener for image load
    $('#fm_main', FocusManga.overlay).load(function() {
      FocusManga.onImgLoad(this);
    });

    // add handler for window resize
    $(window).resize(function() {
      FocusManga.onResize();
    });

    // hide cursor aver 2 sec inactivity
    $(FocusManga.overlay).mousemove(function() {
      $(FocusManga.overlay).removeClass('hideCursor');
      FocusManga.mouse_timer.restart();
    });


    // on close overlay
    $('#fm_close').click(function() {
      FocusManga.onClose();
    });

    chrome.extension.sendRequest({'method': 'options'}, function(response) {
      FocusManga.options.import(response);
      FocusManga.onOptions();
    });

    // toggle timer/img
    FocusManga.updateTimerIcon(false);
    $('#fm_play').click(function() {
      FocusManga.toggleTimer();
    });

    // options page
    $('#fm_options', FocusManga.overlay).click(function() {
      chrome.extension.sendRequest({'method': 'tabs'}, function(response) {});
    });

    FocusManga.setImage();
    FocusManga.updatePageNumber();
    FocusManga.updateName();
  };

  this.toggleTimer = function() {
    if (FocusManga.show_timer.isRunning()) {
      FocusManga.options.set('timer_enabled', false);
      chrome.extension.sendRequest({'method': 'options', 'data': {timer_enabled: false}}, function(response) {});
      FocusManga.show_timer.stop();
      console.log('stopped timer');
      FocusManga.updateTimerIcon(false);
    } else {
      // start timer
      FocusManga.options.set('timer_enabled', true);
      chrome.extension.sendRequest({'method': 'options', 'data': {timer_enabled: true}}, function(response) {});
      FocusManga.next();
      FocusManga.updateTimerIcon(true);
    }
  };

  this.toggleFocusManga = function(force_state_enabled) {
    if (typeof force_state_enabled !== 'undefined') {
      if (force_state_enabled) $('html').addClass('fm_enabled');
      else $('html').removeClass('fm_enabled');
    } else {
      $('html').toggleClass('fm_enabled');
    }
    FocusManga.options.set('focusmanga_enabled', FocusManga.isDisplaying());
    chrome.extension.sendRequest({'method': 'options', 'data': {focusmanga_enabled: FocusManga.isDisplaying()}}, function(response) {});
  };

  this.isDisplaying = function() {
    return $("html").hasClass('fm_enabled');
  };

  this.teardown = function() {
      $('#fm_overlay').remove();
      FocusManga.mouse_timer.stop();
      FocusManga.show_timer.stop();
  };

  this.parsePage = function() {
    // check if we are still on a manga page
    if (!FocusManga.isMangaPage()) {
      FocusManga.teardown();
      return;
    } else if ($('#fm_overlay').length == 0) {
      FocusManga.setup();
    }

    // check if chapter download is available
    if (!FocusManga.downloadChapterEnabled)
      $('#fm_download_container span', FocusManga.overlay).remove();

    // load image
    FocusManga.setImage();
    FocusManga.updatePageNumber();
    FocusManga.updateName();
    if (FocusManga.options.get("timer_enabled", false))
        FocusManga.show_timer.restart();
    FocusManga.preload();
    FocusManga.downloadChapter();
  };

  this.onMouseInactive = function() {
    $(FocusManga.overlay).addClass('hideCursor');
  };
  this.updateTimerIcon = function(state) {
    var url = (state) ? 'img/pause.png' : 'img/play.png';
    $('#fm_play', FocusManga.overlay).attr('src', chrome.extension.getURL(url));
  };

  this.onPageAction = function() {
    FocusManga.toggleFocusManga();
  };

  this.onImgLoad = function(img) {
    FocusManga.img_w = img.width;
    FocusManga.img_h = img.height;
    $(window).resize();
  };

  this.onResize = function() {
    FocusManga.overlay.removeClass('landscape manhwa');
    if (FocusManga.img_h / FocusManga.img_w > 2) {
      FocusManga.overlay.addClass('manhwa');
    } else if (FocusManga.img_w / FocusManga.img_h > $(window).width() / $(window).height()) {
      FocusManga.overlay.addClass('landscape');
    }
  };

  this.onClose = function() {
    FocusManga.toggleFocusManga(false);
  };

  this.onOptions = function() {
    FocusManga.updateTimerIcon(FocusManga.options.get("timer_enabled", false));

    // check if focusmanga is active
    FocusManga.toggleFocusManga(
      FocusManga.options.get("focusmanga_enabled", true)
    );

    if (FocusManga.options.get("timer_enabled", false)) {
      FocusManga.startTimer();
    }

    FocusManga.updatePageNumber();
    FocusManga.updateName();

  };

  this.startTimer = function() {
    FocusManga.show_timer.set({delay: 1000 * FocusManga.options.get("timer_delay", 20)}).start();
    FocusManga.updateTimerIcon(true);
  };

  this.updatePageNumber = function() {
    if(!isNaN(FocusManga.currentPageNumber()) && !isNaN(FocusManga.currentChapterPages())) {
      if (FocusManga.options.get("page_numbers_enabled", true))
        $('#fm_numbers', FocusManga.overlay).show().text(FocusManga.currentPageNumber()+" / "+FocusManga.currentChapterPages());
    }
  };

  this.updateName = function() {
    var name = FocusManga.getCollectionName();
    if (typeof name == "string" && name.length > 0)
      $('#fm_name', FocusManga.overlay).show().text(name);
  };

  /* DOWNLOAD */
  this.download = function() {
    var folder = FocusManga.getCollectionName();
    folder = cleanName(folder);
    if (typeof folder != "string" || folder.length == 0)
      folder = "unsorted";
    var download_options = {
      url: $('#fm_main').attr('src'),
      filename: FocusManga.title + "/" + folder + "/" + FocusManga.getFileName(),
      saveAs: false,
      conflictAction: "overwrite"
    };
    chrome.extension.sendRequest({
      'method': 'download',
      'data': download_options,
      'erase': 2000,
    });
  };

  this.downloadChapterEnabled = function() {
    var folder = FocusManga.getCollectionName();
    if (typeof folder != "string" || folder.length == 0) return false;
    if (isNaN(FocusManga.currentPageNumber())) return false;
    if (isNaN(FocusManga.currentChapterPages())) return false;
    return true;
  };
  this.downloadChapter = function() {
    var currentChapters = FocusManga.options.get("chapter_dl", []);
    var index = currentChapters.indexOf(FocusManga.getCollectionName());
    if (index == -1) return;
    var lastPage = false;
    if (FocusManga.currentPageNumber() == FocusManga.currentChapterPages()) {
      currentChapters.splice(currentChapters.indexOf(index), 1);
      FocusManga.options.set("chapter_dl", currentChapters);
      lastPage = true;
    }

    var folder = FocusManga.getCollectionName();
    folder = cleanName(folder);
    var page_number_len = (""+FocusManga.currentChapterPages()).length;
    var filename = folder + "/" + pad(FocusManga.currentPageNumber(), page_number_len) + "_" + FocusManga.getFileName();

    var download_options = {
      url: $('#fm_main').attr('src'),
      filename: filename,
      saveAs: false,
      conflictAction: "overwrite"
    };
    chrome.extension.sendRequest(
      {
        'method': 'download',
        'data': download_options,
        'erase': 100,
        'chapter': folder,
      },
      function(downloadId) {
        if (lastPage)
          chrome.extension.sendRequest(
            {'method': 'show', 'data': folder},
            function() {
              FocusManga.next();
            });
        else
          FocusManga.next();
      }
    );
  };

  /* KEY BINDINGS */
  this.onKeyDown = function(event) {
    switch (event.which) {
      case 32:
        // space
        if (FocusManga.isDisplaying()) FocusManga.toggleTimer();
        break;
      case 70:
        // f for favorite or focusmanga
        if (event.shiftKey) {
          FocusManga.toggleFocusManga();
        } else {
          if (FocusManga.isDisplaying()) FocusManga.download();
        }
        break;
      case 27:
        FocusManga.toggleFocusManga(false);
        break;
      default:
        console.log(event.which);
    }
  };
  document.onkeydown = this.onKeyDown;
};

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
