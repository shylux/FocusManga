/* NATURAL SORT
 * Thanks to thg435 on Stackoverflow
 * http://stackoverflow.com/questions/15478954/javascript-sort-array-elements-string-with-numbers
 */

function strcmp(a, b) {
    return a > b ? 1 : a < b ? -1 : 0;
}
function natcmp(a, b) {
    var x = [], y = [];

    a.replace(/(\d+)|(\D+)/g, function($0, $1, $2) { x.push([$1 || 0, $2]) })
    b.replace(/(\d+)|(\D+)/g, function($0, $1, $2) { y.push([$1 || 0, $2]) })

    while(x || y) {
        var xx = x.shift();
        var yy = y.shift();
        var nn = (xx[0] - yy[0]) || strcmp(xx[1], yy[1]);
        if(nn) return nn;
    }
    return 0;
}
