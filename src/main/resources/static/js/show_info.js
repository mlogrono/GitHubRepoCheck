$(document).ready(function () {

    let params = getRequestParams();

    setPageHeading(params);
    showResults(params);

    function showResults (params) {
        console.log("Fire next REST request with repo:"+params.repo+" by owner:"+params.owner);
        $("#loader").addClass("loader");


        $("#feedback").html(initialContributorsText());

        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "/api/contributors",
            data: { "repo" : params.repo, "owner" : params.owner},
            dataType: 'json',
            cache: false,
            timeout: 600000,
            success: showContributors,
            error: printError
        });

        function showContributors(data) {
            // var feedbackOutput = "<a target='_self' href='#' style='text-decoration: none'>"; //Prolly do something like show commits in the past 100 commits
            let feedbackOutput = "";
            for (let i = 0; i < data.length; i++) {
                feedbackOutput += "<div class='flex-container-1 repo-select'>";
                feedbackOutput += "<div class='item-1'><strong>"+data[i]["login"]+"("+data[i]["id"]+")</strong></div>";
                feedbackOutput += "<div class='item-1 flex-container-2'>";
                feedbackOutput += "</div>";
                feedbackOutput += "<div class='item-1'><a href='#'><img src='"+data[i]["avatar_url"]+"' width='50px' height='50px' alt='missing'/></a></div>";
                feedbackOutput += "</div>";
                if (i+1 < data.length) {
                    feedbackOutput += "<hr>";
                }
            }
            // feedbackOutput += "</a>";
            $("#loader").removeClass("loader")
            $("#feedback").html(feedbackOutput);
        }
    }

    function setPageHeading(params) {
        $('#repo-title').html("Repository '"+params.owner+"/"+params.repo+"'");
    }

    function initialContributorsText() {
        return "<div style='padding-top: 30px;' class='flex-container-1 justify-content-center'>" +
            "<div class='item-3'>" +
            "<small>Loading contributors...</small>" +
            "</div>" +
            "</div>";
    }
});

