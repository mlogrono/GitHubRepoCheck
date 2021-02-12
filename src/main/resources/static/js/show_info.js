$(document).ready(function () {

    /** To connect data here**/
    showResults();

    function showResults () {
        // console.log("Fire next REST request with repo:"+repo+" by owner:"+owner);

        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "/api/contributors",
            data: { "repo" : repo, "owner" : owner},
            dataType: 'json',
            cache: false,
            timeout: 600000,
            success: showContributors,
            error: printError
        });

        function showContributors(data) {
            var feedbackOutput = "<div class='border rounded extra-color last'>"; // onclick='showResults('repo', 'suzeyu1992');'
            console.log("LEN:"+data.length);
            for (i = 0; i < data.length; i++) {
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
            feedbackOutput += "</div>";
            $("#loader").removeClass("loader")
            $("#feedback").html(feedbackOutput);
            $("#navi").html(createPaging());
        }
    }
});

