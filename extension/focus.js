FocusManga = new function() {
  this.title = "FocusManga",

  //// OVERRIDE ////
  this.isMangaPage = function() {return false;}
  this.hasNextPage = function() {return false;}
  this.setImage = function() {}
  this.getFileName = function() {}
  this.getCollectionName = function() {return 'unsorted'};
  this.currentPageNumber = function() {}
  this.currentChapterPages = function() {}
  this.preload = function() {}
  this.next = function() {}


  this.options = new OptionStorage();
  this.show_timer = $.timer({
    name: "Picture change timer.",
    delay: 20*1000,
    action: function() {
      FocusManga.next();
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
      <span id="fm_info" />\
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
      if (!FocusManga.mouse_just_hidden) {
        FocusManga.mouse_just_hidden = false;
        $(FocusManga.overlay).css('cursor', '');
        FocusManga.mouse_timer.restart();
      }
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
      if (FocusManga.show_timer.isRunning()) {
        FocusManga.options.set('timer_enabled', false);
        chrome.extension.sendRequest({'method': 'options', 'data': FocusManga.options.export()}, function(response) {});
        FocusManga.show_timer.stop();
        console.log('stopped timer');
        FocusManga.updateTimerIcon(false);
      } else {
        // start timer
        FocusManga.options.set('timer_enabled', true);
        chrome.extension.sendRequest({'method': 'options', 'data': FocusManga.options.export()}, function(response) {});
        FocusManga.next();
        FocusManga.updateTimerIcon(true);
      }
    });

    // options page
    $('#fm_options', FocusManga.overlay).click(function() {
      chrome.extension.sendRequest({'method': 'tabs'}, function(response) {});
    });

    FocusManga.setImage();
    FocusManga.updatePageNumber();
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
    if (FocusManga.options.get("timer_enabled", false))
        FocusManga.show_timer.restart();
  }

  this.onMouseInactive = function() {
    $(FocusManga.overlay).css('cursor', 'none');
    FocusManga.mouse_just_hidden = true;
    setTimeout(function() {
      FocusManga.mouse_just_hidden = false;
    }, 500);
  }
  this.updateTimerIcon = function(state) {
    if (state) {
      $('#fm_play', FocusManga.overlay).attr('src', chrome.extension.getURL('img/stop.png'));
    } else {
      $('#fm_play', FocusManga.overlay).attr('src', chrome.extension.getURL('img/play.png'));
    }
  }

  this.onPageAction = function() {
    $('html').toggleClass('fm_enabled');
    FocusManga.options.set('focusmanga_enabled', $('html').hasClass('fm_enabled'));
    chrome.extension.sendRequest({'method': 'options', 'data': FocusManga.options.export()}, function(response) {});
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
    $('html').removeClass('fm_enabled');
    FocusManga.options.set('focusmanga_enabled', $('html').hasClass('fm_enabled'));
    chrome.extension.sendRequest({'method': 'options', 'data': FocusManga.options.export()}, function(response) {});
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
        $('#fm_info', FocusManga.overlay).show().text(FocusManga.currentPageNumber()+" / "+FocusManga.currentChapterPages());
      if (FocusManga.options.get("chapter_progressbar_enabled", true))
        $('#fm_progress', FocusManga.overlay)
          .css('width', Math.round(FocusManga.currentPageNumber() / FocusManga.currentChapterPages() * 100)+"%");
    }
  }

  /* DOWNLOAD */
  this.download = function() {
    chrome.downloads.download({
      url: $('#fm_main').attr('src'),
      filename: FocusManga.title + "/" + FocusManga.getCollectionName() + "/" + FocusManga.getFileName(),
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

}
