function cleanName(name) {
  return name.replace(/[^a-zA-Z0-9\- \[\]]/gi, ''); // Strip any special characters
}

// add listener for page action message
chrome.runtime.onMessage.addListener(() => {
  FocusManga.onPageAction();
});

FocusManga = new function() {
  this.title = "FocusManga";

  //// OVERRIDE ////
  this.hasNextPage = function() {return false;};
  this.setImage = function() {};
  this.getFileName = function() {};
  this.getCollectionName = function() {};
  this.getPageName = function() {return "";};
  this.currentPageNumber = function() {};
  this.currentChapterPages = function() {};
  this.preload = function() {};
  this.next = function() {};
  this.previous = function() {};


  this.options = null;
  this.show_timer = $.timer({
    name: "Picture change timer.",
    delay: 20*1000,
    checkingInterval: 5,
    autoStart: false,
    action: function() {
      if (FocusManga.isDisplaying()) FocusManga.next();
      else FocusManga.show_timer.restart();
    },
    onProgress: function(percentage) {
      FocusManga.onProgress(percentage);
    }
  });
  this.mouse_timer = $.timer({
    name: "Mouse hide timer.",
    delay: 2000,
    action: function() {
      FocusManga.onMouseInactive();
    }
  });
  this.img_w = 0;
  this.img_h = 0;

  this.timer_delays = [3, 5, 10, 20, 30, 40, 60, 120, 300, 600];

  this.manhwa_page_change_block_duration = 700; //ms
  this.manhwa_page_change_blocked_until = null;
  this.manhwa_page_change_block_direction = null;

  // overlay html
  this.overlay = $(`
    <div id="fm_overlay">
      <div id="fm_progress"></div>
      <img id="fm_close" title="Close" alt="Close FocusManga" src=""/>
      <img id="fm_main" src="" />
      <div id="fm_info">
        <span id="fm_numbers"></span>
        <span id="fm_name"></span>
      </div>
      <div id="fm_tools">
        <div><img id="fm_translate" title="Translate" alt="Translate" src=""/></div>
        <div><img id="fm_force_display_node" title="Force display mode" alt="Force display mode" src="" /></div>
        <div><img id="fm_play" title="Play / Pause" alt="Play / Pause" src="" /></div>
        <div id="fm_download_container">
          <img id="fm_download" title="Download Image" alt="Download Image" src="" />
          <div id="fm_download_chap" class="dropup">Download Chapter</div>
        </div>
        <div id="fm_options">
          <img title="Settings" alt="Settings" src="">
          <div class="dropup">
            <dl>
              <dt>Timer</dt>
              <dd><input id="fm_option_timer" placeholder="Loading.." spellcheck="false" /></dd>
             </dl>
          </div>
        </div>
      </div>
    </div>
  `);
  $('#fm_close', this.overlay).attr('src', chrome.runtime.getURL('img/close-circle.png'));
  $('#fm_download', this.overlay).attr('src', chrome.runtime.getURL('img/download.png'));
  $('#fm_force_display_node', this.overlay).attr('src', chrome.runtime.getURL('img/display-normal.png'));
  $('#fm_translate', this.overlay).attr('src', chrome.runtime.getURL('img/download.png')); //TODO
  $('#fm_options img', this.overlay).attr('src', chrome.runtime.getURL('img/options.png'));

  // setup everything
  $('body').ready(function() {FocusManga.onready();});
  this.onready = function() {
    $('body').show();
    FocusManga.parsePage();
    FocusManga.checkUrl();
  };

  this.onProgress = function(percentage) {
    if (FocusManga.options.get("chapter_progressbar_enabled", true))
      $('#fm_progress', FocusManga.overlay)
          .css('width', percentage+"%");
    if (FocusManga.overlay.hasClass('manhwa') && // activate only on manhwa
        FocusManga.options.get("timer-enabled", false) &&
        FocusManga.options.get("manhwa-autoscroll", true)) {
      // this scroll from top to bottom with a stop at the top and bottom
      let scrollTo = percentage * $('#fm_main', FocusManga.overlay).height() / 100 - window.innerHeight / 2;
      FocusManga.overlay.get(0).scroll({top: scrollTo});
    }
  };

  this.lastUrl = window.location.href;
  this.checkUrl = function() {
    if (window.location.href !== FocusManga.lastUrl) {
      FocusManga.parsePage();
      FocusManga.lastUrl = window.location.href;
    }
    setTimeout(FocusManga.checkUrl, 100);
  };

  this.setup = function() {
    // check if it really is a manga page
    if (!FocusManga.isMangaPage()) return;

    // add overlay
    $('body').prepend(FocusManga.overlay);

    // check if timer is supported
    if (!FocusManga.hasNextPage())
      $('#fm_tools', FocusManga.overlay).addClass('fm_disabled');

    // click for next page
    $(document).on('click', '#fm_main', function() {
      if (FocusManga.hasNextPage) {
        FocusManga.next();
      }
    });

    // download click handler
    $(document).on('click', '#fm_download', function() {
      FocusManga.download();
    });
    $(document).on('click', '#fm_download_chap', function() {
      let currentChapters = FocusManga.options.get("chapter_dl", []);
      currentChapters.push(FocusManga.getCollectionName());
      FocusManga.options.set("chapter_dl", currentChapters);
      FocusManga.downloadChapter();
    });

    // add listener for image load
    $(document).on('load', '#fm_main', function() {
      FocusManga.onImgLoad(this);
    });

    // add handler for window resize
    $(window).resize(function() {
      FocusManga.onResize();
    });

    // hide cursor aver 2 sec inactivity
    $(document).on('mousemove', '#fm_overlay', function() {
      $(FocusManga.overlay).removeClass('hideCursor');
      FocusManga.mouse_timer.restart();
    });


    // on close overlay
    $(document).on('click', '#fm_close', function() {
      FocusManga.onClose();
    });

    FocusManga.onOptions();

    // toggle timer/img
    $(document).on('click', '#fm_play', function() {
      FocusManga.toggleTimer();
    });

    // toggle display mode
    $(document).on('click', '#fm_force_display_node', function() {
      FocusManga.overlay.toggleClass('manhwa');
      FocusManga.options.set('force-display-collection', FocusManga.getCollectionName());
      FocusManga.options.set('force-display-mode', (FocusManga.overlay.hasClass('manhwa')) ? 'manhwa' : 'normal');
      FocusManga.updateDisplayModeImg();
    });

    // translate
    $(document).on('click', '#fm_translate', function() {
      // toggle translator
      let translatorEnabled = FocusManga.options.get('translator', false);
      translatorEnabled = !translatorEnabled;
      FocusManga.options.set('translator', translatorEnabled);

      if (!translatorEnabled) {
        // display original file
        $('#fm_main').attr('src', $('#fm_main').data('orig-src'));
        $('#fm_main').removeData('orig-src');
      } else {
        FocusManga.translate();
      }
    });

    // timer delay
    $(document).on('mousewheel', '#fm_option_timer', function(event) {
      event.preventDefault();
      let currDelay = $(this).val();
      if (!currDelay) return;
      currDelay = FocusManga.show_timer.pretty_string_to_seconds(currDelay);
      let stepUp = (event.originalEvent.wheelDelta >= 0);
      let newDelay = -1;
      for (let i = 0; i < FocusManga.timer_delays.length; i++) {
        if (stepUp && currDelay < FocusManga.timer_delays[i]) {
          newDelay = FocusManga.timer_delays[i];
          break;
        }
        if (!stepUp && i > 0 &&
            currDelay <= FocusManga.timer_delays[i] &&
            currDelay > FocusManga.timer_delays[i-1]) {
          newDelay = FocusManga.timer_delays[i-1];
          break;
        }
      }
      if (newDelay !== -1) {
        $(this).val(FocusManga.show_timer.seconds_to_pretty_time(newDelay));
        FocusManga.show_timer.set({delay: newDelay * 1000});
        FocusManga.options.set('timer-delay', newDelay);
      }
    });

    // options page
    $(document).on('click', '#fm_options .dropup .settings_link', function() {
      chrome.runtime.sendMessage({'method': 'tabs'});
    });

    // scrolling to change page

    $(document).on('mousewheel', '#fm_main, #fm_numbers', function(event) {
      if (!FocusManga.overlay.hasClass('manhwa')) {
        // normal page
        if (event.originalEvent.wheelDelta >= 0) {
          // up
          FocusManga.previous();
        } else {
          // down
          FocusManga.next();
        }
      } else {
        // manhwa
        if (event.originalEvent.wheelDelta >= 0) {
          // up
          if (FocusManga.overlay.get(0).scrollTop === 0) {
            // is at top
            if (!FocusManga.manhwa_page_change_blocked_until || FocusManga.manhwa_page_change_block_direction !== -1) {
              // block for 500ms
              FocusManga.manhwa_page_change_blocked_until = Date.now() + FocusManga.manhwa_page_change_block_duration;
              FocusManga.manhwa_page_change_block_direction = -1;
            } else if (FocusManga.manhwa_page_change_blocked_until < Date.now()) {
              FocusManga.manhwa_page_change_block_direction = null;
              FocusManga.previous();
            }
          } else {
            // reset block
            FocusManga.manhwa_page_change_block_direction = null;
          }
        } else {
          // down
          if (FocusManga.overlay.get(0).scrollTop >= $('#fm_main', FocusManga.overlay).height() - window.innerHeight) {
            // is at bottom
            if (!FocusManga.manhwa_page_change_blocked_until || FocusManga.manhwa_page_change_block_direction !== 1) {
              // block for 500ms
              FocusManga.manhwa_page_change_blocked_until = Date.now() + FocusManga.manhwa_page_change_block_duration;
              FocusManga.manhwa_page_change_block_direction = 1;
            } else if (FocusManga.manhwa_page_change_blocked_until < Date.now()) {
              FocusManga.next();
            }
          } else {
            // reset block
            FocusManga.manhwa_page_change_block_direction = null;
          }
        }
      }
    });

    FocusManga.setImage();
    FocusManga.updatePageNumber();
    FocusManga.updateName();
  };

  this.toggleTimer = function() {
    if (FocusManga.show_timer.isRunning()) {
      // stop timer
      FocusManga.show_timer.stop();
      FocusManga.options.set('timer-enabled', false);
      FocusManga.updateTimerIcon(false);
      console.log('stopped timer');
    } else {
      // start timer
      FocusManga.options.set('timer-enabled', true);
      FocusManga.next();
      FocusManga.updateTimerIcon(true);
    }
  };

  this.updateDisplayModeImg = function() {
    let img = (FocusManga.overlay.hasClass('manhwa')) ? 'display-manhwa.png' : 'display-normal.png';
    $('#fm_force_display_node', this.overlay).attr('src', chrome.runtime.getURL('img/'+img));
  };

  this.toggleFocusManga = function(force_state_enabled) {
    if (!FocusManga.isMangaPage()) return;
    if (typeof force_state_enabled !== 'undefined') {
      if (force_state_enabled) $('html').addClass('fm_enabled');
      else $('html').removeClass('fm_enabled');
    } else {
      $('html').toggleClass('fm_enabled');
    }
    FocusManga.options.set('focusmanga-enabled', FocusManga.isDisplaying());
    this.onToggle(FocusManga.isDisplaying());
  };

  this.onToggle = function(newState) {};

  this.isDisplaying = function() {
    return $("html").hasClass('fm_enabled');
  };

  this.teardown = function() {
      $('#fm_overlay').remove();
      FocusManga.mouse_timer.stop();
      FocusManga.show_timer.stop();
  };

  this.parsePage = function() {
    if (!FocusManga.options) {
      OptionStorage.getInstance().then((options) => {
        FocusManga.options = options;
        FocusManga.parsePage();
      });
      return;
    }

    // check if we are still on a manga page
    if (!FocusManga.isMangaPage()) {
      FocusManga.teardown();
      return;
    } else if ($('#fm_overlay').length === 0) {
      FocusManga.setup();
    }

    // check if chapter download is available
    if (!FocusManga.downloadChapterEnabled)
      $('#fm_download_container span', FocusManga.overlay).remove();

    // load image
    FocusManga.setImage();
    $('#fm_main').removeData('orig-src');
    FocusManga.updatePageNumber();
    FocusManga.updateName();
    FocusManga.onResize();
    FocusManga.updateDisplayModeImg();
    if (FocusManga.options.get("timer-enabled", false))
        FocusManga.show_timer.restart();
    FocusManga.preload();
    FocusManga.downloadChapter();
    FocusManga.translate();
  };

  this.onMouseInactive = function() {
    if (FocusManga.options.get('hide-cursor', true))
      $(FocusManga.overlay).addClass('hideCursor');
  };
  this.updateTimerIcon = function(state) {
    let url = (state) ? 'img/pause.png' : 'img/play.png';
    $('#fm_play', FocusManga.overlay).attr('src', chrome.runtime.getURL(url));
  };

  this.onPageAction = function() {
    FocusManga.toggleFocusManga();
  };

  this.onImgLoad = function(img) {
    FocusManga.img_w = img.width;
    FocusManga.img_h = img.height;
    $(window).resize();
    FocusManga.overlay.get(0).scroll({top: 0});
  };

  this.onResize = function() {
    FocusManga.overlay.removeClass('landscape manhwa');
    if (FocusManga.img_h / FocusManga.img_w > 2) {
      FocusManga.overlay.addClass('manhwa');
    } else if (FocusManga.img_w / FocusManga.img_h > $(window).width() / $(window).height()) {
      FocusManga.overlay.addClass('landscape');
    }

    if (FocusManga.options.get('force-display-collection') == FocusManga.getCollectionName()) {
      FocusManga.overlay.addClass(FocusManga.options.get('force-display-mode'));
    }

    FocusManga.updateDisplayModeImg();
  };

  this.onClose = function() {
    FocusManga.toggleFocusManga(false);
  };

  this.onOptions = function() {
    FocusManga.updateTimerIcon(FocusManga.options.get("timer-enabled", false));

    // check if focusmanga is active
    FocusManga.toggleFocusManga(
      FocusManga.options.get("focusmanga-enabled", true)
    );

    $('#fm_option_timer').val(FocusManga.show_timer.seconds_to_pretty_time(FocusManga.options.get("timer-delay", 20)));
    if (FocusManga.options.get("timer-enabled", false)) {
      FocusManga.startTimer();
    }

    FocusManga.updatePageNumber();
    FocusManga.updateName();

  };

  this.startTimer = function() {
    FocusManga.show_timer.set({delay: 1000 * FocusManga.options.get("timer-delay", 20)}).start();
    FocusManga.updateTimerIcon(true);
  };

  this.updatePageNumber = function() {
    if(!isNaN(FocusManga.currentPageNumber()) && !isNaN(FocusManga.currentChapterPages())) {
      if (FocusManga.options.get("page_numbers_enabled", true))
        $('#fm_numbers', FocusManga.overlay).show().text(FocusManga.currentPageNumber()+" / "+FocusManga.currentChapterPages());
    }
  };

  this.updateName = function() {
    let name = FocusManga.getCollectionName();
    if (typeof name == "string" && name.length > 0) {
      if (name.length > 120) {
        name = name.substr(0, 120) + '...';
      }
    }
    let pageName = FocusManga.getPageName();
    if (typeof pageName == "string") {
      name = name + ": " + pageName;
    }
    $('#fm_name', FocusManga.overlay).show().text(name);
  };

  /* DOWNLOAD */
  this.download = function() {
    let folder = FocusManga.getCollectionName();
    folder = cleanName(folder);
    if (typeof folder != "string" || folder.length === 0)
      folder = "unsorted";
    let download_options = {
      url: $('#fm_main').attr('src'),
      filename: FocusManga.title + "/" + folder + "/" + FocusManga.getFileName(),
      saveAs: false,
      conflictAction: "overwrite"
    };
    chrome.runtime.sendMessage({
      'method': 'download',
      'data': download_options,
      'erase': 2000,
    });
  };

  this.downloadChapterEnabled = function() {
    let folder = FocusManga.getCollectionName();
    return !(typeof folder != "string" || folder.length === 0 ||
             isNaN(FocusManga.currentPageNumber()) ||
             isNaN(FocusManga.currentChapterPages()));
  };
  this.downloadChapter = function() {
    let currentChapters = FocusManga.options.get("chapter_dl", []);
    let index = currentChapters.indexOf(FocusManga.getCollectionName());
    if (index === -1) return;
    let lastPage = false;
    if (FocusManga.currentPageNumber() === FocusManga.currentChapterPages()) {
      currentChapters.splice(currentChapters.indexOf(index), 1);
      FocusManga.options.set("chapter_dl", currentChapters);
      lastPage = true;
    }

    let folder = FocusManga.getCollectionName();
    folder = cleanName(folder);
    let page_number_len = (""+FocusManga.currentChapterPages()).length;
    let filename = folder + "/" + pad(FocusManga.currentPageNumber(), page_number_len) + "_" + FocusManga.getFileName();

    let download_options = {
      url: $('#fm_main').attr('src'),
      filename: filename,
      saveAs: false,
      conflictAction: "overwrite"
    };
    chrome.runtime.sendMessage(
      {
        'method': 'download',
        'data': download_options,
        'erase': 100,
        'chapter': folder,
      },
      function(downloadId) {
        if (lastPage)
          chrome.runtime.sendMessage(
            {'method': 'show', 'data': folder},
            function() {
              FocusManga.next();
            });
        else
          FocusManga.next();
      }
    );
  };

  this.translate = function() {
    // don't run when not enabled and when translation is already done or has been initiated
    if (FocusManga.options.get("translator", false) && $('#fm_main').data('orig-src') !== $('#fm_main').attr('src')) {
      $('#fm_main').data('orig-src', $('#fm_main').attr('src')); // save original url for the page change check

      fetch('http://localhost:5003/translate/image', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({
          'image': $('#fm_main').attr('src'),
          'config': {
            "translator": {
              "target_lang": "ENG",
              "translator": "deepl"
            },
          }
        })
      })
      .then(response => response.blob()) // Convert response to a Blob
      .then(blob => {
        const imageUrl = URL.createObjectURL(blob); // Create a temporary URL
        $('#fm_main').attr('src', imageUrl); // Assign it to the image tag
      });
    }
  }

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
        // esc
        FocusManga.toggleFocusManga(false);
        break;
    }
  };
  document.onkeydown = this.onKeyDown;
};

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
