// var request = new XMLHttpRequest();
//
// function searchInfo() {
//     var name = document.vinform.name.value;
//     var url = "index.jsp?val=" + name;
//
//     try {
//         request.onreadystatechange = function () {
//             if (request.readyState == 4) {
//                 var val = request.responseText;
//                 document.getElementById('mylocation').innerHTML = val;
//             }
//         }//end of function
//         request.open("GET", url, true);
//         request.send();
//     } catch (e) {
//         alert("Unable to connect to server");
//     }
// }




$(document).ready(function () {

    var wait;
    var previousQuery;

    var shorten = function (num) {
        return Math.abs(num) > 999 ? Math.sign(num)*((Math.abs(num)/1000).toFixed(1)) + 'k' : Math.sign(num)*Math.abs(num)
    }

    function retrieveRepos(query, page) {
        console.log("Fire REST request!");
        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "/api/query",
            data: { "query" : query, "page" : page },
            dataType: 'json',
            cache: false,
            timeout: 600000,
            success: function (data, textStatus, request) {
                console.log("SUCCESS ("+query+"): "+JSON.stringify(data, null, 4));
                createRepoResponse(data, request.getResponseHeader("link"));
                // console.log("TEXT: "+textStatus);
                // console.log("REQ: "+request);
            },
            error: function (e) {
                var prettyJson = JSON.stringify(JSON.parse(e.responseText), null, 4)
                var feedbackOutput = "<h5>Ajax Response Error</h5><pre>"
                    + prettyJson + "</pre>";
                $("#feedback").removeClass("loader").html(feedbackOutput);

                console.log("ERROR ("+query+"): "+prettyJson);
            }
        });
    }

    function createPaging() {
        var str = "<div><nav aria-label='Page navigation'>";
        str += "<ul className='pagination justify-content-center'>";
        str += "<li className='page-item disabled'>";
        str += "<a className='page-link' href='#' tabIndex='-1'>Previous</a>";
        str += "</li>";
        str += "<li className='page-item'><a className='page-link' href='#'>1</a></li>";
        str += "<li className='page-item'><a className='page-link' href='#'>2</a></li>";
        str += "<li className='page-item'><a className='page-link' href='#'>3</a></li>";
        str += "<li className='page-item'>";
        str += "<a className='page-link' href='#'>Next</a>";
        str += "</li>";
        str += "</ul>";
        str += "</nav></div>";
        return str;
    }

    function createRepoResponse (data, link) {

        var i, feedbackOutput;
        feedbackOutput = "<div class='border rounded extra-color last'>"; // onclick='showResults('repo', 'suzeyu1992');'
        console.log("LEN:"+data.length);
        for (i = 0; i < data.length; i++) {
            feedbackOutput += "<div class='flex-container repo-select' onclick='showResults(\""+data[i]["name"]+"\", \""+data[i].owner["login"]+"\")'>";
                feedbackOutput += "<div class='item'><h5>"+data[i]["full_name"]+"</h5></div>";
                feedbackOutput += "<div class='item flex-container2'>";
                    feedbackOutput += "<div class='item2'><img src='img/fork.svg'/><small>"+shorten(data[i]["forks_count"])+"</small></div>";
                    feedbackOutput += "<div class='item2'><img src='img/star.svg'/><small>"+shorten(data[i]["stargazers_count"])+"</small></div>";
                feedbackOutput += "</div>";
                feedbackOutput += "<div class='item'><small>"+data[i]["description"]+"</small></div>";
            feedbackOutput += "</div>";
            if (i+1 < data.length) {
                feedbackOutput += "<hr>";
            }
        }
        feedbackOutput += "</div>";
        feedbackOutput += createPaging();


        $("#feedback").removeClass("loader")
            .html(feedbackOutput);
    }

    $("#repo-select").keyup(function (event) {
        event.preventDefault();
        var repo = "";
        var owner = "";
        showResults(repo, owner);
    });

    $("#query-form").keyup(function (event) {
        event.preventDefault();
        var query = $("#query-box").val()
        console.log("Char "+query);
        if (query.length > 3 && previousQuery !== query) {
            $("#feedback").addClass("loader")
                .html("");
            previousQuery = query;
            clearTimeout(wait);
            wait = setTimeout(function () {
                retrieveRepos(query, 1);
            }, 2000);
        }
        else if (query.length <= 3 && query.length > 0){
            $("#feedback").removeClass("loader")
                .html("<h8>Query text is too short. Need more info.</h8>");
            previousQuery = "";
        }
    });

    $("#query-box").keypress(function (event){
        var pattern = /[a-zA-Z0-9.\-_]/;
        if (!pattern.test(String.fromCharCode(event.which))) {
            console.log("Not accepted input");
            event.preventDefault();
        }
        else {
            console.log("Key '"+String.fromCharCode(event.which)+"'("+event.which+")");
            //
            // if (!$("#loader").length) {
            //     var feedbackOutput = "<div id=\"loader\" class=\"loader\"/>";
            //     $("#feedback").html(feedbackOutput);
            // }
        }
        // event.preventDefault();
    });


    // $("#query-box").keypress(function (event){
    //     if (event.which === 13) {
    //         // console.log("Enter key detected.")
    //         event.preventDefault();
    //     }
    //     if ($("#loader").length) {
    //         console.log("-->");
    //         var feedbackOutput = "<div class=\"loader\"/>";
    //         $("#feedback").html(feedbackOutput);
    //     }
    // });
});


function showResults (repo, owner) {
    // repo = "repo";
    // owner = "suzeyu1992";
    console.log("Fire next REST request with repo:"+repo+" by owner:"+owner);

    $.ajax({
        type: "GET",
        contentType: "application/json",
        url: "/api/contributors",
        data: { "repo" : repo, "owner" : owner},
        dataType: 'json',
        cache: false,
        timeout: 600000,
        success: function (data) {
            showContributors(data);
        },
        error: function (e) {
            var prettyJson = JSON.stringify(JSON.parse(e.responseText), null, 4)
            var feedbackOutput = "<h5>Ajax Response Error</h5><pre>"
                + prettyJson + "</pre>";
            $("#feedback").removeClass("loader").html(feedbackOutput);

            console.log("ERROR ("+query+"): "+prettyJson);
        }
    });


    function showContributors(data) {
        var feedbackOutput = "<div class='border rounded extra-color last'>"; // onclick='showResults('repo', 'suzeyu1992');'
        console.log("LEN:"+data.length);
        for (i = 0; i < data.length; i++) {
            feedbackOutput += "<div class='flex-container repo-select'>";
            feedbackOutput += "<div class='item'><strong>"+data[i]["login"]+"("+data[i]["id"]+")</strong></div>";
            feedbackOutput += "<div class='item flex-container2'>";
            // feedbackOutput += "<div class='item2'><img src='img/fork.svg'/><small>"+shorten(data[i]["forks_count"])+"</small></div>";
            // feedbackOutput += "<div class='item2'><img src='img/star.svg'/><small>"+shorten(data[i]["stargazers_count"])+"</small></div>";
            feedbackOutput += "</div>";
            feedbackOutput += "<div class='item'><a href='#'><img src='"+data[i]["avatar_url"]+"' width='50px' height='50px' alt='missing'/></a></div>";
            feedbackOutput += "</div>";
            if (i+1 < data.length) {
                feedbackOutput += "<hr>";
            }
        }
        feedbackOutput += "</div>";
        $("#feedback").removeClass("loader").html(feedbackOutput);
    }
}

