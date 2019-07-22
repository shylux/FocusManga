function parseHistoryFile(data) {
  let lines = data.split(/[\r\n]+/);
  for (let i in lines) {
    let line = lines[i];
    switch(line[0]) {
      case '#':
        $('body').append($("<h3></h3>").text(line.substring(1)));
        break;
      case 'B':
        $('body').append($('<p><img src="img/bug.png" /></p>').append(line.substring(1)));
        break;
      case 'S':
        $('body').append($('<p><img src="img/rocket.png" /></p>').append(line.substring(1)));
        break;
      case 'F':
        $('body').append($('<p><img src="img/truck.png" /></p>').append(line.substring(1)));
        break;
      default:
        $('body').append($("<p></p>").text(line));
        break;
    }
  }
}

$(function() {
  let options = new OptionStorage();
  // set checkbox and handler
  $('#version_on_update').prop('checked', options.get('version_on_update', true));
    $('#version_on_update').click(function() {
    options.set('version_on_update', this.checked);
    $('#toast').show().text('Open version history on update: '+this.checked);
  });

  // load history
  let history_url = chrome.extension.getURL('HISTORY.txt');
  $.ajax({
    url: history_url,
    success: parseHistoryFile
  });
});
