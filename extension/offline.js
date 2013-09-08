var file_list = [];
var file_index = 0;

$(function() {

  $('body').append('<input id="filedrop" type="file" webkitdirectory multiple="multiple" />');
  $('#filedrop').on('drop', function(event) {
    console.log("drop2");
    var files = event.originalEvent.dataTransfer.files;
  });
  $('#filedrop').on('change', function(event) {
    console.log('drop');
    file_list = []
    file_index = 0;
    for (var i = 0, file; file=event.target.files[i]; i++) {
      if (file.type.match('image.*'))
        file_list.push(file);
    }
    dragleave();
    next(0);
  });

  $('body').on('dragenter', dragenter);
  //$('#filedrop').on('dragleave', dragleave);
});

function dragenter() {
  console.log('enter');
  $('body').addClass('hack');
  $('#filedrop').show();
}
function dragleave() {
  console.log('leave');
  $('body').removeClass('hack');
  $('#filedrop').hide();
}

function next(index) {
  if (file_list.length == 0) return;
  if (index === undefined) index = file_index++;
  file_index = index;

  var file = file_list[file_index];

  var reader = new FileReader();
  reader.onload = (function(file) {
    return function(e) {
      $('#fm_main', FocusManga.overlay).attr('src', e.target.result);
    }
  })(file);

  reader.readAsDataURL(file);
}


FocusManga.isMangaPage = function() {return true;}
FocusManga.hasNextPage = function() {return true;}
FocusManga.next = function() {next();}
FocusManga.currentPageNumber = function() {return file_index+1;}
FocusManga.currentChapterPages = function() {return file_list.length;}


