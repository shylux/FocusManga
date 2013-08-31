$(function() {
  $('#filedrop').change(function(event) {
    var files = event.target.files;
    for (var i = 0, file; file=files[i]; i++) {
      // check if mime type contains image
      if (!file.type.match('image.*')) continue;
      var reader = new FileReader();

      reader.onload = (function(file) {
        return function(e) {
          var span = $('<span><img /></span>');
          $('img', span).attr('src', e.target.result)
                        .attr('title', file.name);
          $('body').append(span);
        };
      })(file);

      reader.readAsDataURL(file);
    }
  });
});
