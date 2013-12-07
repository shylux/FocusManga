var file_list = [];
var file_index = parseHashLocation();

$(function() {
  $('html').addClass('fm_enabled');

  $('body').append('<div class="filedrop">Drop your picture folder here.</div><input class="filedrop" type="file" webkitdirectory />');
  $('input.filedrop').on('change', function(event) {
    console.log('drop');
    file_list = []
    for (var i = 0, file; file=event.target.files[i]; i++) {
      if (file.type.match('image.*'))
        file_list.push(file);
    }
    
    // sort list alphabetically
    file_list.sort(function(a, b) {
      if (a.webkitRelativePath < b.webkitRelativePath) return -1;
      if (a.webkitRelativePath > b.webkitRelativePath) return 1;
      return 0;
    });

    dragleave();
    if (file_index == -1) file_index = 0;

    FocusManga.setImage();
    FocusManga.updatePageNumber();
    $('#fm_info').css('visibility', 'visible');
  });

  $('body').on('dragenter', dragenter);
  //$('#filedrop').on('dragleave', dragleave);

  $(window).keydown(function(event) {
    switch(event.which) {
      case 39:
        // right
        step(1);
        break;
      case 37:
        // left
        step(-1);
    }
  });

  // scroll event
  $('#fm_info').bind('mousewheel', function(event) {
    if (event.originalEvent.wheelDelta >= 0) {
      // up
      step(-1);
    } else {
      // down
      step(1);
    }
  });
});

function dragenter() {
  console.log('enter');
  $('body').addClass('hack');
  $('.filedrop').show();
}
function dragleave() {
  console.log('leave');
  $('body').removeClass('hack');
  $('.filedrop').hide();
}

function step(delta) {
  if (file_list.length == 0) return;
  file_index = file_index + delta;
  if (file_index < 0) file_index = file_list.length-1;
  if (file_index >= file_list.length) file_index = 0;

  window.location.hash = file_index+1;
}

function parseHashLocation() {
  // strip hash symbol
  var str_index = window.location.hash.substring(1);
  // check if user deleted the number
  if (str_index.length == 0) return 0; // redirect to pic 0
  // check if hash is number
  if (str_index.length >= 0 && !isNaN(str_index)) {
    var index = parseInt(str_index);
    if (index <= 0) return 0;
    return index-1;
  }
  return -1;
}


FocusManga.isMangaPage = function() {return true;}
FocusManga.hasNextPage = function() {return true;}
FocusManga.next = function() {
  step(1);
  if (FocusManga.options.get("timer_enabled", false)) {
    FocusManga.startTimer();
  }
}
FocusManga.currentPageNumber = function() {return file_index+1;}
FocusManga.currentChapterPages = function() {return file_list.length;}
FocusManga.onClose = function() {}
FocusManga.onPageAction = function() {}
FocusManga.setImage = function() {
  hash = parseHashLocation();
  if (hash >= 0 && hash < file_list.length)
    file_index = hash;
  else
    // user went out of bounds. cage him.
    if (file_list.length > 0)
      window.location.hash = file_index+1;

  var file = file_list[file_index];

  var reader = new FileReader();
  reader.onload = (function(file) {
    return function(e) {
      $('#fm_main', FocusManga.overlay).attr('src', e.target.result);
      FocusManga.updatePageNumber();
    }
  })(file);

  reader.readAsDataURL(file);
}
FocusManga.getFileName = function() {return file_list[file_index].name;}
FocusManga.getCollectionName = function() {return file_list[0].webkitRelativePath.split('/')[0];}
