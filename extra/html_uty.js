/*
 * jQuery based HTML helpers
 * 
 * author: Capelli Carlo
 * license: MIT
 */

function keys_css(S) {
    var G = {}
    for(k in S) {
        var K = k
        if (k.toLowerCase() != k)
            K = k.replace(/([A-Z])/g, '-$1').toLowerCase()
        G[K] = S[k]
    }
    return G
}

function tag(tag, As) {
    if (As.length == 2) {
        const S = As[0].style
        if (S) {
            delete As[0].style
            return $(tag, {html: As[1]}).attr(As[0]).css(S)
        }
        return $(tag, {html: As[1]}).attr(As[0])
    }
    return $(tag, {html: As[0]})
}
function tr     () { return tag('<tr>', arguments) }
function td     () { return tag('<td>', arguments) }
function th     () { return tag('<th>', arguments) }
function div    () { return tag('<div>', arguments) }
function pre    () { return tag('<pre>', arguments) }
function span   () { return tag('<span>', arguments) }
function table  () { return tag('<table>', arguments) }
function label  () { return tag('<label>', arguments) }
function select () { return tag('<select>', arguments) }
function option () { return tag('<option>', arguments) }

function input  (A){ return $('<input>').attr(A) }

/* from https://stackoverflow.com/q/24816/874024
  Create an in-memory tag, set its inner text (which jQuery automatically encodes)
  Then grab the encoded contents back out. The tag never exists on the page.
*/
function htmlEncode(value) {
    return $('<div/>').text(value).html()
}
/*
function htmlEncode(tag, value) {
    return $(tag).text(value).html();
}
function escapeHtml(string) {}
function htmlEncode(string) {
    const entityMap = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;',
        '`': '&#x60;',
        '=': '&#x3D;',
        '/': '&#x2F;',
    }
    return String(string).replace(/[&<>"'`=\/]/g, function(s) {
        return entityMap[s];
    })
}
*/
function htmlDecode(value) {
    return $('<div/>').html(value).text()
}

function print_r(r) {
    return JSON.stringify(r, null, 2)
}
