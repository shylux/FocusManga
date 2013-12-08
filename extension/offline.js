var file_list = [];
var file_index = parseHashLocation();
var collection_list = [];

$(function() {
  $('html').addClass('fm_enabled');

  $('body').append('<div class="filedrop">Drop your picture folder here.</div><input class="filedrop" type="file" webkitdirectory />');
  $('input.filedrop').on('change', function(event) {
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

    // build collection dict
    for (var i = 0, file; file=file_list[i]; i++) {
      var name = parseCollectionName(file);
      if (collection_list.indexOf(name) == -1)
        collection_list.push(name);
    }

    // check if user used other source than last time
    if (parseCollectionName(currFile()) != localStorage.lastCollection) {
      window.location.hash = 1;
    }


    dragleave();
    if (file_index == -1) file_index = 0;

    FocusManga.setImage();
    FocusManga.updatePageNumber();
    FocusManga.updateName();
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
  $('#fm_name').bind('mousewheel', function(event) {
    if (event.originalEvent.wheelDelta >= 0) {
      // up
      stepCollection(-1);
    } else {
      // down
      stepCollection(1);
    }
  });

  $('#fm_main, #fm_numbers').bind('mousewheel', function(event) {
    if (event.originalEvent.wheelDelta >= 0) {
      // up
      step(-1);
    } else {
      // down
      step(1);
    }
  });
});

function currFile() {
  return file_list[file_index];
}

function dragenter() {
  $('body').addClass('hack');
  $('.filedrop').show();
}
function dragleave() {
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

function stepCollection(delta) {
  if (!currFile()) return;
  var currColName = parseCollectionName(currFile());
  var col_index = collection_list.indexOf(currColName);
  var new_index = (col_index+delta) % collection_list.length;
  if (new_index<0) new_index+=collection_list.length; // fix modulo bug
  var newColName = collection_list[new_index];
  for (var i = 0, file; file=file_list[i]; i++) {
    if (newColName == parseCollectionName(file)) {
      file_index = i;
      window.location.hash = file_index+1;
      return;
    }
  }
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

// Extracts deepest folder name of file
function parseCollectionName(file) {
  path = file.webkitRelativePath.split('/');
  return path[path.length-2];
}

FocusManga.isMangaPage = function() {return true;}
FocusManga.hasNextPage = function() {return true;}
FocusManga.next = function() {
  step(1);
  if (FocusManga.options.get("timer_enabled", false)) {
    FocusManga.startTimer();
  }
}
FocusManga.currentPageNumber = function() {
  if (!currFile()) return file_index+1;
  var curr_collection = parseCollectionName(currFile());
  var counter = 0;
  for (var i = 0, file; file=file_list[i]; i++) {
    if (curr_collection == parseCollectionName(file)) counter++;
    if (file == currFile()) return counter;
  }
  return 0;
}
FocusManga.currentChapterPages = function() {
  if (!currFile()) return 0;
  var curr_collection = parseCollectionName(currFile());
  var counter = 0;
  for (var i = 0, file; file=file_list[i]; i++) {
    if (curr_collection == parseCollectionName(file)) counter++;
  }
  return counter;
}
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

  var file = currFile();

  var reader = new FileReader();
  reader.onload = (function(file) {
    return function(e) {
      $('#fm_main', FocusManga.overlay).attr('src', e.target.result);
      FocusManga.updatePageNumber();
    }
  })(file);

  reader.readAsDataURL(file);
}
FocusManga.getFileName = function() {return currFile().name;}
FocusManga.getCollectionName = function() {
  if (currFile()) {
    var name = parseCollectionName(currFile());
    localStorage.lastCollection = name;
    return name;
  }
  return undefined;
}
