/**
 * Handles animation and search.
 * Upon search, searches a random 5-letter query from youtube until it gets the result. 
 * Help from: https://developers.google.com/youtube/v3/docs/search/list
 */ 

var POSSIBLE = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789 ";
var SEARCH_LENGTH = 5;
var ATTEMPTS = 100;

function makeid() {

    var text = "";
    for (var i = 0; i < SEARCH_LENGTH; i++)
        text += POSSIBLE.charAt(Math.floor(Math.random() * POSSIBLE.length));

    return text;
}

async function searchUntilFound() {
    const results = await buildApiRequest('GET',
        '/youtube/v3/search',
        {
            'maxResults': '25',
            'part': 'id',
            'q': makeid(),
            'type': '',
            'safeSearch': 'strict'
        });
    console.log(results.items.length)
    if (results.items.length > 0 && results.items[0].id && results.items[0].id.videoId) return results;
    return await searchUntilFound();
}

var watchingVid = false;

$("#find-video").click(function() {
    $("#find-video").fadeOut('slow');
    searchUntilFound().then(function (results) {
        var vid = results.items[0].id.videoId;
        console.log(vid);
        $("#test")
        .hide()
        .html(`<iframe width="560" height="315" src="https://www.youtube.com/embed/${vid}" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>`)
        .find("iframe")
        .load(function () {
            $("#test").show();
            $("#cover").css({ top: '-100vh' });
            watchingVid = true;
        });
    });
});

$("#hover-area").mouseover(function(){
    if (!watchingVid) return;
    $("#find-another").show();
    $("#cover").css({ top: 'calc(-100vh + 56px)' });
});

$("#hover-area").mouseout(function () {
    if (watchingVid) $("#cover").css({ top: '-100vh' });
});

$("#hover-area").click(function() {
    if (!watchingVid) return;
    watchingVid = false;
    $("#find-another").fadeOut();
    $("#find-video").show();
    $("#cover").css({ top: '0' });
})

function defineRequest() {
    $("#find-video").fadeIn();
}