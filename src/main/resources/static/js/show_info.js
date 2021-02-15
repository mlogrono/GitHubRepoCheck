$(document).ready(function () {

    let infoHeight = '650px';
    let params = getRequestParams();

    setPageHeading(params);
    retrieveContributors(params);

    function retrieveContributors (params) {

        console.log("Fire contributors REST request with repo:"+params.repo+" by owner:"+params.owner);
        $("#loader1").addClass("loader");
        $("#loader2").addClass("loader");
        $("#feedback1").html(initialText("Loading contributors...")).css('height', '');;
        $("#feedback2").html(initialText("Loading Git logs...")).css('height', '');

        $.ajax({
            type: "GET",
            contentType: "application/json",
            url: "/api/contributors",
            data: { "repo" : params.repo, "owner" : params.owner},
            dataType: 'json',
            cache: false,
            timeout: 600000,
            success: retrieveCommits,
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
                    printGITHtml(contributors, commits);
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
                    let contributor = contributors[i];
                    let committer = commits[j].author;
                    if (contributor && committer && contributor.login === committer.login) {
                        ct++;
                    }
                }
                counters[i] = { login: contributors[i].login, avatar_url: contributors[i].avatar_url, count: ct};
                console.log(counters[i]);
                recordCount += ct;
            }

            counters.sort(function (a, b){
                let ret = b.count - a.count;
                if (ret === 0) {
                    if (b.login !== null && a.login !== null) {
                        ret = a.login.localeCompare(b.login);
                    }
                }
                return ret;
            });
            console.log(counters);

            printContributorsHtml(counters, recordCount);
        }
    }

    function printContributorsHtml(displayItems, itemCount) {
        // console.log("---------------");
        let str = "";
        $('#show-commits-header').html("Past "+itemCount+" commits by Author");
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
                            str += "width='40px' height='40px'";
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

        $("#loader1").removeClass("loader");
        $("#feedback1").html(str).css('height', infoHeight);;
        setBarAnimation();

    }

    //commit ca82a6dff817ec66f44342007202690a93763949
    //Author: Scott Chacon <schacon@gee-mail.com>
    //Date:   Mon Mar 17 21:52:11 2008 -0700
    //
    //    Change version number

    function printGITHtml(contributors, commits) {
        let str = "";

        for (let i = 0; i < commits.length; i++) {
            str += "<div style='padding-right: 3%; padding-left: 3%;'>";
                str += "<div><strong>commit</strong><small> "+commits[i].sha+"</small></div>";
                let author = commits[i].commit.author;
                str += "<div><strong>Author:</strong><small> "+author.name+" &lt;"+author.email+"&gt;</small></div>";
                str += "<div><strong>Date:</strong><small> "+author.date+"</small></div>";
                str += "<div style='margin: 15px 20px 30px 20px;'><small>"+commits[i].commit.message+"</small></div>";
            str += "</div>";
            if (i + 1 < commits.length) {
                str += "<hr>";
            }
        }

        $("#loader2").removeClass("loader");
        $("#feedback2").html(str).css('height', infoHeight);
    }

    function setPageHeading(params) {
        $('#repo-title').html("Repository '"+params.owner+"/"+params.repo+"'");
    }

    function initialText(string) {
        return "<div style='padding-top: 30px;' class='flex-container-1 justify-content-center'>" +
            "<div class='item-3'>" +
            "<small>"+string+"</small>" +
            "</div>" +
            "</div>";
    }
});

