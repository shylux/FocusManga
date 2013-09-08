var file_list = [];
var file_index = 0;

$(function() {

  $('body').append('<div class="filedrop">Drop your folder/files here.</div><input class="filedrop" type="file" webkitdirectory multiple="multiple" />');
  $('input.filedrop').on('change', function(event) {
    console.log('drop');
    file_list = []
    file_index = 0;
    for (var i = 0, file; file=event.target.files[i]; i++) {
      if (file.type.match('image.*'))
        file_list.push(file);
    }
    dragleave();
    file_index = 0;
    step(0);
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
        step(-1)
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


FocusManga.isMangaPage = function() {return true;}
FocusManga.hasNextPage = function() {return true;}
FocusManga.next = function() {step(1);}
FocusManga.currentPageNumber = function() {return file_index+1;}
FocusManga.currentChapterPages = function() {return file_list.length;}
FocusManga.onClose = function() {}
FocusManga.onPageAction = function() {}
