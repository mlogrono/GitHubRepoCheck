function printError(e) {
    console.log("EResp: "+e.responseText);
    let prettyJson = JSON.stringify(JSON.parse(e.responseText), null, 4)
    let feedbackOutput = "<div class='flex-container-1'><div class='item-3'><h5>Response Error</h5><pre>"
        + prettyJson + "</pre></div></div>";
    console.log("ERROR: "+prettyJson);

    $("#loader").removeClass("loader");
    $("#feedback").html(feedbackOutput);
    $("#navi").html("");
    toggleSearchBox();
}

function toggleSearchBox() {
    $("#query-box").prop("disabled", function(tagsFound, currentVal) {
        //Do something here.
        return !currentVal;
    });
}

function getRequestParams() {
    let params = {};
    let query = window.location.search.substring(1).split('&');
    for (let i = 0; i < query.length; i++) {
        let pair = query[i].split('=');
        params[pair[0]] = pair[1];
    }
    return params;
}