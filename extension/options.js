const options = new OptionStorage();

const defaultValues = {
    'timer-delay': 20,
    'focusmanga-enabled': true,
    'timer-enabled': false,
    'page-numbers-enabled': true,
    'progressbar-enabled': true,
    'exif-rotation-correction-enabled': false
};

const changeTypes = {
    'B': ['Bugfix', 'img/bug.png'],
    'S': ['Awesome Feature', 'img/rocket.png'],
    'F': ['Feature', 'img/truck.png']
};

$(document).ready(function() {

    // load checkbox options
    $('#options :checkbox').each(function() {
        let id = $(this).attr('id');
        let value = options.get(id, defaultValues[id]);
        $(this).prop('checked', value);
    });

    // load timer delay
    $('#timer-delay').val(options.get('timer-delay', defaultValues['timer-delay']));

    // list hoster
    let hosterTemplate = $('#hoster-list .hoster').remove();
    for (let i in hoster_list) {
        let host = hoster_list[i];
        let copy = hosterTemplate.clone();
        copy.attr('href', 'http://' + host.hostname);
        $('.name', copy).text(host.hostname);
        // icon
        let icon = (host.icon) ? host.icon : 'http://' + host.hostname + '/favicon.ico';
        $('img.icon', copy).attr('src', icon);
        if (host.mature) {
            $('#hoster-list .mature .list-group').append(copy);
        } else {
            $('#hoster-list .everyone .list-group').append(copy);
        }
    }

    // load version history
    let history_url = chrome.extension.getURL('HISTORY.txt');
    let versionTemplate = $('#version-history .version').remove();
    $.ajax({
        url: history_url,
        success: function(data) {
            for (const versionEntry of data.split('#')) {
                if (versionEntry.trim().length === 0) continue;

                let versionCopy = versionTemplate.clone();
                let lines = versionEntry.split('\n');
                // version number
                //let versionNumber = lines.shift().replace('Version', '').trim();
                $('.card-header', versionCopy).text(lines.shift().trim());

                // changes
                let changeTemplate = $('.change', versionCopy).remove();
                for (const change of lines) {
                    if (change.trim().length === 0) continue;
                    let changeCopy = changeTemplate.clone();
                    // type image
                    let changeType = changeTypes[change.substr(0, change.indexOf(' '))];
                    $('img', changeCopy).attr({src: changeType[1], alt: changeType[0]});

                    // message
                    let changeMessage = change.substr(change.indexOf(' ') + 1);
                    $('.change-desc', changeCopy).text(changeMessage);
                    $('.changes', versionCopy).append(changeCopy);
                }

                $('#version-history .col').append(versionCopy);
            }
        }
    });
});

// handle option changes
$('#options :checkbox').on('change', function() {
    let id = $(this).attr('id');
    options.set(id, $(this).prop('checked'));
});
$('#timer-delay').on('input', function() {
    options.set('timer-delay', $(this).val());
});

// open all hoster
$('#open-all-hoster').on('click', function() {
    for (let i in hoster_list) {
        let hoster = hoster_list[i];
        chrome.tabs.create({url: 'http://' + hoster.hostname + hoster.examplePage});
    }
});