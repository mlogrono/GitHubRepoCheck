var glo_page = 1;

$(document).ready(function () {
    var wait;
    var previousQuery;

    // extended();


    // $("#repo-select").keyup(function (event) {
    //     event.preventDefault();
    //     var repo = "";
    //     var owner = "";
    //     showResults(repo, owner);
    // });
    // $("#repo-select").keydown(function (event) {
    //     var key = event.keyCode || event.charCode;
    //     var query = $("#query-box").val();
    //     console.log("back/del detected");
    //     if (key == 8 || key == 46) {
    //         if (query.length <= 3 && previousQuery !== query) {
    //             console.log("timeout cleared");
    //             clearTimeout(wait);
    //             return false;
    //         }
    //     }
    // });

    $("#query-form").keyup(function (event) {
        event.preventDefault();
        var query = $("#query-box").val();
        console.log("Char "+query+" len:"+query.length);
        clearTimeout(wait);
        if (query.length > 3){// && previousQuery !== query) {
            console.log("WHAT");
            $("#loader").addClass("loader");
            $("#feedback").html("<div style='padding-top: 30px;' class='flex-container-1 justify-content-center'><div class='item-3'><small>Checking repository names, descriptions, README files...</small></div></div>");
            $("#navi").html("");
            console.log("Difference: "+previousQuery+" and "+query);
            if (previousQuery !== query){
                glo_page = 1;
            }
            previousQuery = query;
            wait = setTimeout(function () {
                retrieveRepos(query, glo_page);
            }, 3000);
        }
        else if (query.length === 0) {
            $("#feedback").html("<div class='flex-container-1'><div class='item-3'><small>You stare blankly into space.</small></div></div>");
        }
        else if (query.length <= 3 && query.length > 0){
            var feedbackOutput = "<div class='flex-container-1'><div class='item-3'><small>Query text is too short. Need more info.</small></div></div>";
            $("#loader").removeClass("loader");
            $("#feedback").html(feedbackOutput);
            $("#navi").html("");
            previousQuery = "";
        }
        console.log("End");
    });

    $("#query-box").keypress(function (event){
        var pattern = /[a-zA-Z0-9.\-_]/;
        if (!pattern.test(String.fromCharCode(event.which))) {
            console.log("Not accepted input");
            event.preventDefault();
        }
        else {
            console.log("Key '"+String.fromCharCode(event.which)+"'("+event.which+")");
        }
    });
});

// function toggleSearchBox() {
//     $("#query-box").prop("disabled", function(tagsFound, currentVal) {
//         //Do something here.
//         return !currentVal;
//     });
// }
//
// function printError(e) {
//     console.log("EResp: "+e.responseText);
//     var prettyJson = JSON.stringify(JSON.parse(e.responseText), null, 4)
//     var feedbackOutput = "<div class='flex-container-1'><div class='item-3'><h5>Response Error</h5><pre>"
//         + prettyJson + "</pre></div></div>";
//     console.log("ERROR: "+prettyJson);
//
//     $("#loader").removeClass("loader");
//     $("#feedback").html(feedbackOutput);
//     $("#navi").html("");
//     toggleSearchBox();
// }

function parseRequestParams(responseHeader) {
    var linkParsed;
    if (responseHeader != null) {
        linkParsed = responseHeader.split("?")[1].split("&")[1].split("=")[1];
    }
    else {
        console.log("Link parsing: " + linkParsed + " will be converted to ''");
        linkParsed = "";
    }
    return linkParsed;
}

var shorten = function (num) {
    return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
}

function createRepoResponse (data, textStatus, link) {

    let i, feedbackOutput = "";
    console.log(">>> LINK: "+textStatus+" "+link.getResponseHeader('next'));
    // feedbackOutput = "<div class='border rounded extra-color last'>"; // onclick='showResults('repo', 'suzeyu1992');'
    console.log("LEN:"+data.length);
    if (data.length > 0) {
        for (i = 0; i < data.length; i++) {
            feedbackOutput += "<a target='_self' href='/repo?repo=" + data[i]["name"] + "&owner=" + data[i].owner["login"]+"' style='text-decoration: none;'>";
            // feedbackOutput += "<a target='_self' href='/repository_info.html' style='text-decoration: none;'>";
            // feedbackOutput += "<div class='flex-container-1 repo-select' onclick='showResults(\"" + data[i]["name"] + "\", \"" + data[i].owner["login"] + "\")'>";
            feedbackOutput += "<div class='flex-container-1 repo-select'>";
            feedbackOutput += "<div class='item-1'><h6>" + data[i]["full_name"] + "</h6></div>";
            feedbackOutput += "<div class='item-1 flex-container-2'>";
            feedbackOutput += "<div class='item-2' style='text-align: center'><img src='img/fork.svg'/><small style='padding-left: 5px;'>" + shorten(data[i]["forks_count"]) + "</small></div>";
            feedbackOutput += "<div class='item-2' style='text-align: center'><img src='img/star.svg'/><small style='padding-left: 5px;'>" + shorten(data[i]["stargazers_count"]) + "</small></div>";
            // feedbackOutput += "<div class='item-2'><svg viewBox='0 0 512 512' enable-background='new 0 0 512 512'\"' xml:space='\"'preserve'\"' width='24' height='24' viewBox='0 0 24 24'><path fill-rule='evenodd' d='M5 3.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm0 2.122a2.25 2.25 0 10-1.5 0v.878A2.25 2.25 0 005.75 8.5h1.5v2.128a2.251 2.251 0 101.5 0V8.5h1.5a2.25 2.25 0 002.25-2.25v-.878a2.25 2.25 0 10-1.5 0v.878a.75.75 0 01-.75.75h-4.5A.75.75 0 015 6.25v-.878zm3.75 7.378a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm3-8.75a.75.75 0 100-1.5.75.75 0 000 1.5z'></path></svg><small>"+shorten(data[i]["forks_count"])+"</small></div>";
            // feedbackOutput += "<div class='item-2'><svg enable-background='new 0 0 512 512' width='24' height='24' viewBox='0 0 24 24'><path fill-rule='evenodd' d='M8 .25a.75.75 0 01.673.418l1.882 3.815 4.21.612a.75.75 0 01.416 1.279l-3.046 2.97.719 4.192a.75.75 0 01-1.088.791L8 12.347l-3.766 1.98a.75.75 0 01-1.088-.79l.72-4.194L.818 6.374a.75.75 0 01.416-1.28l4.21-.611L7.327.668A.75.75 0 018 .25zm0 2.445L6.615 5.5a.75.75 0 01-.564.41l-3.097.45 2.24 2.184a.75.75 0 01.216.664l-.528 3.084 2.769-1.456a.75.75 0 01.698 0l2.77 1.456-.53-3.084a.75.75 0 01.216-.664l2.24-2.183-3.096-.45a.75.75 0 01-.564-.41L8 2.694v.001z'></path></svg><small>"+shorten(data[i]["stargazers_count"])+"</small></div>";
            feedbackOutput += "</div>";
            feedbackOutput += "<div class='item-1'><small>" + data[i]["description"] + "</small></div>";
            feedbackOutput += "</div>";
            feedbackOutput += "</a>";

            if (i + 1 < data.length) {
                feedbackOutput += "<hr>";
            }
        }
        $("#navi").html(createPaging(link));
    }
    else {
        feedbackOutput += "<div class='flex-container-1'>";
        feedbackOutput += "<div class='item-3'>";
        feedbackOutput += "<a><small>Sorry, the query matches no known repository in GitHub.</small></a>";
        feedbackOutput += "</div>";
        feedbackOutput += "</div>";
        // feedbackOutput += "<div class='flex-container-1 repo-select' >";
        // feedbackOutput += "<div class='item-1'><h5>WHAT THE HELL</h5></div>";
        // feedbackOutput += "</div>"
    }
    // feedbackOutput += "</div>";
    // feedbackOutput += createPaging();


    $("#loader").removeClass("loader");
    $("#feedback").html(feedbackOutput);
    toggleSearchBox();
}

function retrieveRepos(query, page) {
    toggleSearchBox();
    console.log("Fire REST request!");

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "/api/query",
        data: { "query" : query, "page" : page },
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: createRepoResponse,
        error: printError
    });
}

function createPaging(link) {
    var dirFirst = parseRequestParams(link.getResponseHeader('first'));
    var dirPrev = parseRequestParams(link.getResponseHeader('prev'));
    var dirNext = parseRequestParams(link.getResponseHeader('next'));
    var dirLast = parseRequestParams(link.getResponseHeader('last'));
    console.log(dirFirst+" - "+dirPrev+" - "+dirNext+" - "+dirLast);

    var str = "<div class='flex-container-1 justify-content-center' style='padding-top: 20px;'><div class='item-3'><nav aria-label='Page navigation'>";
    str += "<ul class='pagination justify-content-center'>";

    str += "<li class='page-item ";
    if (dirFirst === "") {
        str += "disabled'><div><a class='page-link' tabIndex='-1' href='#'>First</a></div></li>";
    }
    else {
        str += "'><div onclick='$(function(){ glo_page = "+dirFirst+"; $(\"#query-box\").keyup(); });'><a class='page-link' tabIndex='-1' href='#'>First</a></div></li>";
    }

    var intPrev = parseInt(dirPrev);
    var intNext = parseInt(dirNext);
    var page;
    if (intPrev === undefined || isNaN(intPrev)) {
        page = intNext - 1;
    }
    else {
        page = intPrev + 1;
    }

    console.log("END PAGINATION");
    if(dirPrev !== "") {
        str += "<li class='page-item'><div onclick='$(function(){ glo_page = "+intPrev+"; $(\"#query-box\").keyup(); });'><a class='page-link' href='#'>" + intPrev + "</a></div></li>";
    }
    str += "<li class='page-item disabled'><a class='page-link' href='#' >"+page+"</a></li>";
    if (dirNext !== "") {
        str += "<li class='page-item'><div onclick='$(function(){ glo_page = "+intNext+"; $(\"#query-box\").keyup(); });'><a class='page-link' href='#'>" + intNext + "</a></div></li>";
    }
    str += "<li class='page-item ";
    if (dirLast === "") {
        str += "disabled";
    }
    str += "'><div onclick='$(function(){ glo_page = "+dirLast+"; $(\"#query-box\").keyup(); });'><a class='page-link' href='#' >Last</a></div></li>";
    str += "</ul>";
    str += "</nav></div></div>";
    console.log("END PAGINATION");
    return str;
}


