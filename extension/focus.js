FocusManga = new function() {
  this.title = "FocusManga",

  //// OVERRIDE ////
  this.isMangaPage = function() {return false;}
  this.hasNextPage = function() {return false;}
  this.setImage = function() {}
  this.getFileName = function() {}
  this.getCollectionName = function() {}
  this.currentPageNumber = function() {}
  this.currentChapterPages = function() {}
  this.preload = function() {}
  this.next = function() {}


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
  this.overlay = $('\
    <div id="fm_overlay">\
      <div id="fm_progress"></div>\
      <img id="fm_close" />\
      <img id="fm_main" />\
      <div id="fm_info">\
        <span id="fm_numbers" />\
        <span id="fm_name">test asdf fb bjub</span>\
      </div>\
      <div id="fm_tools">\
        <img id="fm_play">\
        <img id="fm_download">\
        <img id="fm_options">\
      </div>\
    </div>');
  $('#fm_close', this.overlay).attr('src', chrome.extension.getURL('img/close-circle.png'));
  $('#fm_download', this.overlay).attr('src', chrome.extension.getURL('img/download.png'));
  $('#fm_options', this.overlay).attr('src', chrome.extension.getURL('img/options.png'));

  // setup everything
  $('body').ready(function() {FocusManga.onready();});
  this.onready = function() {
    $('body').show();
    FocusManga.setup();
  }

  this.setup = function() {
    // check if it really is a manga page
    if (!FocusManga.isMangaPage()) return;

    // online only actions
    if (typeof chrome.downloads == 'undefined') {
      $('#fm_download', FocusManga.overlay).hide();
    }

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
  }

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
  }

  this.toggleFocusManga = function(force_state_enabled) {
    if (typeof force_state !== 'undefined') {
      if (force_state_enabled) $('html').addClass('fm_enabled');
      else $('html').removeClass('fm_enabled');
    } else {
      $('html').toggleClass('fm_enabled');
    }
    FocusManga.options.set('focusmanga_enabled', FocusManga.isDisplaying());
    chrome.extension.sendRequest({'method': 'options', 'data': {focusmanga_enabled: FocusManga.isDisplaying()}}, function(response) {});
  }

  this.isDisplaying = function() {
    return $("html").hasClass('fm_enabled');
  }

  this.teardown = function() {
      $('#fm_overlay').remove();
      FocusManga.mouse_timer.stop();
      FocusManga.show_timer.stop();
  }

  this.parsePage = function() {
    // check if we are still on a manga page
    if (!FocusManga.isMangaPage()) {
      FocusManga.teardown();
      return;
    } else if ($('#fm_overlay').length == 0) {
      FocusManga.setup();
      return;
    }

    // load image
    FocusManga.setImage();
    FocusManga.updatePageNumber();
    FocusManga.updateName();
    if (FocusManga.options.get("timer_enabled", false))
        FocusManga.show_timer.restart();
  }

  this.onMouseInactive = function() {
    $(FocusManga.overlay).addClass('hideCursor');
  }
  this.updateTimerIcon = function(state) {
    if (state) {
      $('#fm_play', FocusManga.overlay).attr('src', chrome.extension.getURL('img/stop.png'));
    } else {
      $('#fm_play', FocusManga.overlay).attr('src', chrome.extension.getURL('img/play.png'));
    }
  }

  this.onPageAction = function() {
    FocusManga.toggleFocusManga();
  }

  this.onImgLoad = function(img) {
    FocusManga.img_w = img.width;
    FocusManga.img_h = img.height;
    $(window).resize();
  }

  this.onResize = function() {
    if (FocusManga.img_w / FocusManga.img_h < $(window).width() / $(window).height()) {
      $('#fm_main', FocusManga.overlay)
        .removeClass('landscape')
        .css('margin-top', 'auto');
    } else {
      $('#fm_main', FocusManga.overlay)
        .addClass('landscape')
        .css('margin-top', -($('#fm_main', FocusManga.overlay).height() / 2));
    }
  }

  this.onClose = function() {
    FocusManga.toggleFocusManga(false);
  }

  this.onOptions = function() {
    FocusManga.updateTimerIcon(FocusManga.options.get("timer_enabled", false));

    // check if focusmanga is active
    if (FocusManga.options.get("focusmanga_enabled", true))
      $('html').addClass('fm_enabled');

    if (FocusManga.options.get("timer_enabled", false)) {
      FocusManga.startTimer();
    }

    FocusManga.updatePageNumber();
    FocusManga.updateName();

  }

  this.onPageChange = function() {
    console.log("CHANGE");
    FocusManga.parsePage();
  }
  window.onhashchange = this.onPageChange;

  this.startTimer = function() {
    FocusManga.show_timer.set({delay: 1000 * FocusManga.options.get("timer_delay", 20)}).start();
    console.log("start timer");
    FocusManga.updateTimerIcon(true);
  }

  this.updatePageNumber = function() {
    if(!isNaN(FocusManga.currentPageNumber()) && !isNaN(FocusManga.currentChapterPages())) {
      if (FocusManga.options.get("page_numbers_enabled", true))
        $('#fm_numbers', FocusManga.overlay).show().text(FocusManga.currentPageNumber()+" / "+FocusManga.currentChapterPages());
    }
  }

  this.updateName = function() {
    var name = FocusManga.getCollectionName();
    if (typeof name == "string" && name.length > 0)
      $('#fm_name', FocusManga.overlay).show().text(name);
  }

  /* DOWNLOAD */
  this.download = function() {
    var folder = FocusManga.getCollectionName();
    if (typeof folder != "string" || folder.length == 0)
      folder = "unsorted";
    chrome.downloads.download({
      url: $('#fm_main').attr('src'),
      filename: FocusManga.title + "/" + folder + "/" + FocusManga.getFileName(),
      saveAs: false,
      conflictAction: "overwrite"
    }, function(downloadId) {
      // on download finish
      setTimeout(
        function() {
          chrome.downloads.erase({id: downloadId});
        },
        2000);
    });
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
        if (event.shiftKey)
          FocusManga.toggleFocusManga();
        else
          if (FocusManga.isDisplaying()) FocusManga.download();
        break;
      case 27:
        FocusManga.toggleFocusManga(false);
        break;
      default:
        console.log(event.which);
    }
  }
  document.onkeydown = this.onKeyDown;
}
