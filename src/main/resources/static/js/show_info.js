$(document).ready(function () {

    let params = getRequestParams();

    setPageHeading(params);
    retrieveContributors(params);

    function retrieveContributors (params) {

        console.log("Fire contributors REST request with repo:"+params.repo+" by owner:"+params.owner);
        $("#loader1").addClass("loader");
        $("#feedback1").html(initialContributorsText());

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
        $('#show-commits-header').html("Past "+itemCount+" commits");
        for (let i = 0; i < displayItems.length; i++) {
            let holder = "";
            if (displayItems[i].count > 0) {
                holder = "user-select";
            }
            str += "<div class='"+holder+"' style='padding-left: 3%; padding-right: 3%;'>";
                str += "<div class='flex-container-2 ' style='display: flex; align-items:center; overflow: hidden;'>";
                    str += "<div style='margin-right: 10px;'>";
                        str += "<img style='vertical-align: middle;' src='"+displayItems[i]["avatar_url"]+"' ";
                        if (displayItems[i].count > 0) {
                            str += "width='60px' height='60px'";
                        }
                        else {
                            str += "width='20px' height='20px'";
                        }
                        str += " alt='missing'/>";
                    str += "</div>";
                    str += "<div style='flex-direction: column; align-content: stretch; flex-grow: 1;'>";
                        if (displayItems[i].count > 0) {
                            holder = "strong";
                        }
                        else {
                            holder = "small";
                        }
                       str += "<div><"+holder+" style='flex-grow: 1;'>" + displayItems[i].login + "</"+holder+"></div>";
                        if (displayItems[i].count > 0) {
                            str += "<div><small style='flex-grow: 1; align-content: stretch; font-weight: lighter;'>" + displayItems[i].count + " of " + itemCount + " commits</small></div>";
                        }
                    str += "</div>";
                str += "</div>";
                if (displayItems[i].count > 0) {
                    str += "<div style='flex-grow: 1;'>";
                    str += "<div class='bar' style='flex-wrap: wrap; height: 20px; overflow: hidden; display: flex; align-items: center;' data-percent='" + (displayItems[i].count / itemCount) * 100 + "%'></div>";
                    str += "</div>";
                }
            str += "</div>";

            if (i+1 < displayItems.length) {
                str += "<hr>";
            }
        }

        // for (let i = 0; i < displayItems.length; i++) {
        //     str += "<div class='flex-container-4 user-select' style='align-items:center;'>";
        //         str += "<div class=' ' style='display: flex; align-items:center; width: 20%; flex-direction: row-reverse;'>";
        //             str += "<img style='vertical-align: middle; margin-left: 10px;' src='"+displayItems[i]["avatar_url"]+"' width='50px' height='50px' alt='missing'/>";
        //             str += "<small>"+displayItems[i]["login"]+"</small>";
        //         str += "</div>";
        //         str += "<div style='vertical-align: middle; flex-grow: 1; '>";
        //             str += "<div class='bar' style='flex-wrap: wrap; height: 20px; overflow: hidden' data-percent='"+(displayItems[i].count/itemCount)*100+"%'></div>";
        //         str += "</div>"
        //     str += "</div>";
        //     if (i+1 < displayItems.length) {
        //         str += "<hr>";
        //     }
        // }

        // for (let i = 0; i < displayItems.length; i++) {
        //     str += "<div class='flex-container-4 user-select' style='align-items:center; flex-direction: row-reverse;'>";
        //     str += "<div class='bar' style='height: 20px; overflow: hidden' data-percent='"+(displayItems[i].count/itemCount)*100+"%'></div>";
        //         str += "<img style='vertical-align: middle; margin-left: 10px;' src='"+displayItems[i]["avatar_url"]+"' width='50px' height='50px' alt='missing'/>";
        //         str += "<small>"+displayItems[i]["login"]+"</small>";
        //         // str += "<div>"
        //
        //         // str += "</div>";
        //     str += "</div>";
        //
        //     if (i+1 < displayItems.length) {
        //         str += "<hr>";
        //     }
        // }

        $("#loader1").removeClass("loader")
        $("#feedback1").html(str);
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

