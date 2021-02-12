function printError(e) {
    console.log("EResp: "+e.responseText);
    var prettyJson = JSON.stringify(JSON.parse(e.responseText), null, 4)
    var feedbackOutput = "<div class='flex-container-1'><div class='item-3'><h5>Response Error</h5><pre>"
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
