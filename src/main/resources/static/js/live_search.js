let glo_page = 1;

$(document).ready(function () {
    let wait;
    let previousQuery;
    let startSize = 3;

    if (("#query-box").length >= startSize) {
        $("#query-form").keyup();
    }

    $("#query-form").keyup(function (event) {
        event.preventDefault();
        let query = $("#query-box").val();
        console.log("Char "+query+" len:"+query.length);
        clearTimeout(wait);
        if (query.length >= startSize){
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
        else if (query.length < startSize && query.length > 0){
            let feedbackOutput = "<div class='flex-container-1'><div class='item-3'><small>Query text is too short. Need more info.</small></div></div>";
            $("#loader").removeClass("loader");
            $("#feedback").html(feedbackOutput);
            $("#navi").html("");
            previousQuery = "";
        }
        console.log("End");
    });

    $("#query-box").keypress(function (event){
        let pattern = /[a-zA-Z0-9.\-_]/;
        if (!pattern.test(String.fromCharCode(event.which))) {
            console.log("Not accepted input");
            event.preventDefault();
        }
        else {
            console.log("Key '"+String.fromCharCode(event.which)+"'("+event.which+")");
        }
    });
});

function parseRequestParams(responseHeader) {
    let linkParsed;
    if (responseHeader != null) {
        linkParsed = responseHeader.split("?")[1].split("&")[1].split("=")[1];
    }
    else {
        console.log("Link parsing: " + linkParsed + " will be converted to ''");
        linkParsed = "";
    }
    return linkParsed;
}

function shorten(num) {
    return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
}

function createRepoResponse(data, textStatus, link) {

    let i, feedbackOutput = "";
    console.log(">>> LINK: "+textStatus+" "+link.getResponseHeader('next'));
    console.log("LEN:"+data.length);
    if (data.length > 0) {
        for (i = 0; i < data.length; i++) {
            feedbackOutput += "<a target='_self' href='/repository?repo=" + data[i]["name"] + "&owner=" + data[i].owner["login"]+"' style='text-decoration: none;'>";
            feedbackOutput += "<div class='flex-container-1 repo-select'>";
            feedbackOutput += "<div class='item-1'><h6>" + data[i]["full_name"] + "</h6></div>";
            feedbackOutput += "<div class='item-1 flex-container-2'>";
            feedbackOutput += "<div class='item-2' ><img src='img/fork.svg'/><small style='padding-left: 3px;'>" + shorten(data[i]["forks_count"]) + "</small></div>";
            feedbackOutput += "<div class='item-2' ><img src='img/star.svg'/><small style='padding-left: 3px;'>" + shorten(data[i]["stargazers_count"]) + "</small></div>";
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
    }

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
    let dirFirst = parseRequestParams(link.getResponseHeader('first'));
    let dirPrev = parseRequestParams(link.getResponseHeader('prev'));
    let dirNext = parseRequestParams(link.getResponseHeader('next'));
    let dirLast = parseRequestParams(link.getResponseHeader('last'));
    console.log(dirFirst+" - "+dirPrev+" - "+dirNext+" - "+dirLast);

    let str = "<div class='flex-container-1 justify-content-center' style='padding-top: 20px;'><div class='item-3'><nav aria-label='Page navigation'>";
    str += "<ul class='pagination justify-content-center'>";

    str += "<li class='page-item ";
    if (dirFirst === "") {
        str += "disabled'><div><a class='page-link' tabIndex='-1' href='#'>First</a></div></li>";
    }
    else {
        str += "'><div onclick='$(function(){ glo_page = "+dirFirst+"; $(\"#query-box\").keyup(); });'><a class='page-link' tabIndex='-1' href='#'>First</a></div></li>";
    }

    let intPrev = parseInt(dirPrev);
    let intNext = parseInt(dirNext);
    let page;
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


