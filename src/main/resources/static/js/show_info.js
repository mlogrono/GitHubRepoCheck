$(document).ready(function () {

    let params = getRequestParams();

    setPageHeading(params);
    retrieveContributors(params);

    function retrieveContributors (params) {

        console.log("Fire contributors REST request with repo:"+params.repo+" by owner:"+params.owner);
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
            success: retrieveCommits,
            // success: function(data) { allContributors = data; },
            error: printError
        });

        function retrieveCommits(contributors) {
            $.ajax({
                type: "GET",
                contentType: "application/json",
                url: "/api/commits",
                data: { "repo" : params.repo, "owner" : params.owner},
                dataType: 'json',
                cache: false,
                timeout: 600000,
                success: function(commits){
                    showContributorsData(contributors, commits);
                },
                error: printError
            });
        }

        function showContributorsData(contributors, commits) {
            console.log(contributors);
            console.log(commits);
            let counters = [{}], recordCount = 0;

            for (let i = 0; i < contributors.length; i++) {
                let ct = 0;
                for (let j = 0; j < commits.length; j++) {
                    console.log("Count: "+i+" "+j);
                    let contributor = contributors[i];
                    let committer = commits[j].committer;
                    if (contributor && committer && contributor.login === committer.login) {
                        ct++;
                    }
                }
                counters[i] = { login: contributors[i].login, avatar_url: contributors[i].avatar_url, count: ct};
                recordCount += ct;
            }

            counters.sort(function (a, b){
                return b.count - a.count;
            });
            console.log(counters);

            printContributorsHtml(counters, recordCount);
        }
    }

    function printContributorsHtml(displayItems, itemCount) {
        // console.log("---------------");
        let str = "";
        for (let i = 0; i < displayItems.length; i++) {
            str += "<div class='flex-container-4 user-select' style='align-items:center; flex-direction: row-reverse;'>";
            str += "<img style='vertical-align: middle; margin-left: 10px;' src='"+displayItems[i]["avatar_url"]+"' width='50px' height='50px' alt='missing'/>";
            str += "<small>"+displayItems[i]["login"]+"</small>";
            // str += "<div class='bar' data-percent='"+(displayItems[i].count/itemCount)*100+"%'><span class='label'>"+displayItems[i].count+"</span></div>";

            str += "</div>";
            str += "<div class='bar' style='height: 20px;' data-percent='"+(displayItems[i].count/itemCount)*100+"%'></div>";

            // str += "<div class='bar' data-percent='90%'><span class='label'>820</span></div>";
            // str += "<div class='bar' data-percent='85%'><span class='label'>"+displayItems[i].count+"</span></div>";

            if (i+1 < displayItems.length) {
                str += "<hr>";
            }
        }
// let i = 0;
//         str += "<div class='bar' data-percent='40%'></div>";
        // str += "<div class='bar' data-percent='"+(displayItems[i].count/itemCount)*100+"%'><span class='label'>"+displayItems[i].count+"</span></div>";
        // str += "<div class='bar' data-percent='"+(displayItems[i].count/itemCount)*100+"%'><span class='label'>"+displayItems[i].count+"</span></div>";

        $("#loader").removeClass("loader")
        $("#feedback").html(str);
        setBarAnimation();

        // console.log("---------------");
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

