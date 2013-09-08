FocusManga = new function() {

  //// OVERRIDE ////
  this.isMangaPage = function() {return false;}
  this.hasNextPage = function() {return false;}
  this.setImage = function() {}
  this.currentPageNumber = function() {}
  this.currentChapterPages = function() {}
  this.preload = function() {}
  this.next = function() {}


  this.options = new OptionStorage();
  this.timer;
  this.img_w;
  this.img_h;

  // overlay html
  this.overlay = $('\
    <div id="fm_overlay">\
      <div id="fm_progress"></div>\
      <img id="fm_close" />\
      <a id="fm_imgnext">\
        <img id="fm_main" />\
      </a>\
      <span id="fm_info" />\
      <div id="fm_tools">\
        <img id="fm_play">\
        <img id="fm_options">\
      </div>\
    </div>');
  $('#fm_close', this.overlay).attr('src', chrome.extension.getURL('img/close-circle.png'));
  $('#fm_options', this.overlay).attr('src', chrome.extension.getURL('img/options.png'));

  // setup everything
  $('body').ready(function() {FocusManga.onready();});
  this.onready = function() {
    $('body').show();

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

    // add listener for image load
    $('#fm_main', FocusManga.overlay).load(function() {
      FocusManga.onImgLoad(this);
    });

    // load image
    FocusManga.setImage();
  
    // add handler for window resize
    $(window).resize(function() {
      FocusManga.onResize();
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
      if (FocusManga.timer) {
        FocusManga.options.set('timer_enabled', false);
        chrome.extension.sendRequest({'method': 'options', 'data': FocusManga.options.export()}, function(response) {});
        clearTimeout(FocusManga.timer);
        FocusManga.timer = undefined;
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
      $('#fm_main', FocusManga.overlay).removeClass('landscape');
    } else {
      $('#fm_main', FocusManga.overlay).addClass('landscape');
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
      FocusManga.timer = setTimeout("FocusManga.next();", 1000 * FocusManga.options.get("timer_delay", 20));
      console.log("start timer");
      FocusManga.updateTimerIcon(true);
    }

    FocusManga.updatePageNumber();

    // timer
    if (FocusManga.hasNextPage) {
      $('#fm_imgnext', FocusManga.overlay).attr('href', "#").click(function() {
        FocusManga.next();
      });
    }
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
}
