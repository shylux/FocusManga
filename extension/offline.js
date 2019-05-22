var file_list = [];
var file_index = parseHashLocation();
var collection_list = [];
var collection_start_indices = {};
var collection_sizes = {};

$(function() {
  $('html').addClass('fm_enabled');

  $('body').append(`<div class="filedrop">Drop your picture folder here.</div><input class="filedrop" type="file" webkitdirectory multiple /><div id="fm_catalog"></div>`);
  $('#fm_tools').prepend('<img id="fm_catalog_icon" title="Catalog">');
  $('#fm_catalog_icon', this.overlay).attr('src', chrome.extension.getURL('img/catalog.png'));

  $('#fm_catalog_icon').on('click', toggleCatalog);
  $('#fm_catalog').on('click', toggleCatalog);

  $('input.filedrop').on('dragover', function(event) {
    event.preventDefault();
  });
  $('input.filedrop').on('drop', loadImages);


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
        break;
      case 27:
          if ($('#fm_catalog').is(':visible'))
              toggleCatalog();
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

// traverse dropped folders
// add all files to file_list
async function traverseFileTree(item, path) {
  path = path || "";
  if (item.isFile) {
    // Get file
    await new Promise(resolve => {
      item.file(function (file) {
        file.fullPath = this.fullPath;
        if (file.type.match('image.*'))
          file_list.push(file);
        resolve();
      }.bind(item));
    });
  } else if (item.isDirectory) {
    // Get folder contents
    let dirReader = item.createReader();
    await new Promise(resolve => {
      function keepReading() {
        dirReader.readEntries(async function (entries) {
          if (entries.length === 0) {resolve(); return;}
          for (let i = 0; i < entries.length; i++) {
            await traverseFileTree(entries[i], path + item.name + "/");
          }
          keepReading();
        })
      }
      keepReading();
    });
  }
}

// load dropped images
async function loadImages(event) {
  let items = event.originalEvent.dataTransfer.items;
  let promises = [];
  for (let i = 0; i < items.length; i++) {
    // webkitGetAsEntry is where the magic happens
    let item = items[i].webkitGetAsEntry();
    if (item) {
      promises.push(traverseFileTree(item, ""));
    }
  }
  Promise.all(promises).then(processLoadedFiles);
}

function processLoadedFiles() {
  // sort list alphabetically
  file_list.sort(function(a, b) {
    // sort first by collection
    var collectionCompare = naturalSort(parseCollectionName(a), parseCollectionName(b));
    if (collectionCompare != 0) return collectionCompare;
    return naturalSort(a.fullPath, b.fullPath);
  });

  // build collection dict
  for (var i = 0, file; file=file_list[i]; i++) {
    var name = parseCollectionName(file);
    if (collection_list.indexOf(name) == -1) {
      collection_list.push(name);
      collection_start_indices[name] = i;
      collection_sizes[name] = 0;
    }
    collection_sizes[name]++;
  }

  // check if user used other source than last time
  if (file_list.length < file_index || parseCollectionName(currFile()) !== localStorage.lastCollection) {
    window.location.hash = '1';
  }

  dragleave();
  if (file_index == -1) file_index = 0;

  FocusManga.parsePage();
  $('#fm_info').css('visibility', 'visible');
}

/* PAGE CHANGE */
var parsedUrl = window.location.toString();
function checkPageChange() {
  if (parsedUrl != window.location.toString()) {
    parsedUrl = window.location.toString();
    FocusManga.parsePage();
  }
}
setInterval(checkPageChange, 10);

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
  var path = file.fullPath.split('/');
  return path[path.length-2];
}

// Catalog
function toggleCatalog() {
  // hide
  if ($('#fm_catalog').is(':visible')) {
    $('#fm_catalog').hide();
    return;
  }

  // show
  $('#fm_catalog').show();


  if ($('#fm_catalog a').size() == 0) {
    for (var key in collection_start_indices) {
      var file = file_list[collection_start_indices[key]];
      var reader = new FileReader();
      reader.onload = (function (collection) {
        return function (e) {
          var template = $('<a><img src="" /><span></span></a>');
          template.data('collection-name', collection);
          template.attr('href', '#' + (collection_start_indices[collection] + 1));
          template.find('span').text(collection_sizes[collection]);
          template.find('img').attr('src', e.target.result);
          $('#fm_catalog').append(template);
          sortCatalog();
        }
      })(key);
      reader.readAsDataURL(file);
    }
  }
}

function sortCatalog() {
  var collections = $('#fm_catalog > a').get();
  collections.sort(function(a, b) {
    return collection_start_indices[$(a).data('collection-name')] - collection_start_indices[$(b).data('collection-name')];
  });
  for (var i = 0; i < collections.length; i++) {
      collections[i].parentNode.appendChild(collections[i]);
  }
}

$('#fm_catalog img', FocusManga.overlay).on('load', function(img) {
  debugger;
});

FocusManga.isDisplaying = function() {return true;};
FocusManga.isMangaPage = function() {return true;};
FocusManga.hasNextPage = function() {return true;};
FocusManga.next = function() {
  step(1);
  if (FocusManga.options.get("timer_enabled", false)) {
    FocusManga.startTimer();
  }
};
FocusManga.currentPageNumber = function() {
  if (!currFile()) return file_index+1;
  var curr_collection = parseCollectionName(currFile());
  var counter = 0;
  for (var i = 0, file; file=file_list[i]; i++) {
    if (curr_collection == parseCollectionName(file)) counter++;
    if (file == currFile()) return counter;
  }
  return 0;
};
FocusManga.currentChapterPages = function() {
  if (!currFile()) return 0;
  var curr_collection = parseCollectionName(currFile());
  var counter = 0;
  for (var i = 0, file; file=file_list[i]; i++) {
    if (curr_collection == parseCollectionName(file)) counter++;
  }
  return counter;
};
FocusManga.onClose = function() {};
FocusManga.onPageAction = function() {};
FocusManga.setImage = function() {
  var hash = parseHashLocation();
  if (hash >= 0 && hash < file_list.length)
    file_index = hash;
  else
    // user went out of bounds. cage him.
    if (file_list.length > 0)
      window.location.hash = file_index+1;

  var file = currFile();
  if (!file) return;

  var reader = new FileReader();
  reader.onload = (function(file) {
    return function(e) {
      $('#fm_main', FocusManga.overlay).attr('src', e.target.result);
      FocusManga.updatePageNumber();
    }
  })(file);

  reader.readAsDataURL(file);
};
FocusManga.getFileName = function() {return currFile().name;};
FocusManga.getCollectionName = function() {
  if (currFile()) {
    var name = parseCollectionName(currFile());
    localStorage.lastCollection = name;
    return name;
  }
  return undefined;
};
FocusManga.toggleFocusManga = function() {}; // disable disable