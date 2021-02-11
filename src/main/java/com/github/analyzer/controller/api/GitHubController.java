package com.github.analyzer.controller.api;

import com.github.analyzer.model.Repositories;
import com.github.analyzer.model.Repository;
import com.github.analyzer.model.User;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.ClientResponse;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Flux;
import reactor.core.publisher.Mono;

import java.net.URI;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.atomic.AtomicReference;

@RestController
public class GitHubController {
    private static final String query = "query";
    private static final String page = "page";

    private static final String repo = "repo";
    private static final String owner = "owner";

    @GetMapping("/api/query")
    public ResponseEntity<List<Repository>> query(@RequestParam(name = query) String queryText, @RequestParam(name = page, defaultValue = "1") String pageNumber) {
        WebClient client = GitHubClient.built();
        final HttpHeaders headers = new HttpHeaders();
        System.out.println("Query ongoing!");
        List<Repository> repos = client.get()
                .uri(uriBuilder -> {
                    URI path = uriBuilder.path("/search/repositories")
//                            .queryParam("q", queryText+"+in:name")
                            .queryParam("q", queryText)
                            .queryParam("page", pageNumber)
                            .queryParam("per_page","20").build();
                    System.out.println("PATH: "+path.toString());
                    return path;
                })
                .exchangeToFlux(response -> {
                    if (response.statusCode().equals(HttpStatus.OK)) {
                        Map<String, String> map = parseLinkHeader(response.headers());
                        for (String key: map.keySet()) {
                            headers.add(key, map.get(key));
                        }

                        return response.bodyToFlux(Repositories.class)
                                .map(repositories -> {
                                    headers.add("rec-count", Integer.toString(repositories.getTotalCount()));
                                    return repositories;
                                })
                                .map(Repositories::getItems);
                    }
                    else if (response.statusCode().is4xxClientError()) {
                        System.out.println("4XX Error: "+response.toString());
                        return Flux.error(new Exception("Error 4XX: Client Error: " + response.toString()));
                    }
                    else if (response.statusCode().is5xxServerError()) {
                        System.out.println("5XX Error: "+response.toString());
                        return Flux.error(new Exception("Error 5XX: Server Error: "+response.toString()));
                    }
                    else {
                        System.out.println("ERROR");
                        return Flux.error(new Exception("ERROR"));
                    }
                })
                .blockLast();

        for (String x: headers.keySet()) {
            System.out.println("K:"+x+" - V:"+headers.get(x));
        }


        return new ResponseEntity<>(repos, headers, HttpStatus.OK);
    }

    private Map<String, String> parseLinkHeader(ClientResponse.Headers respHeaders) {
        List<String> tempHeaders = respHeaders.header("link");
        Map<String, String> map = new HashMap<>();
        if (tempHeaders.size() == 1) {
            String[] splits = tempHeaders.get(0).split(",");
            String[] furtherSplit;
            for(String sp: splits) {
                System.out.println("HEAD: " + sp);
                 furtherSplit = sp.split(">; rel=\"");
                 map.put(furtherSplit[1].trim().substring(0, furtherSplit[1].trim().length() - 1),
                         furtherSplit[0].trim().substring(1));
            }
        }

        return map;
    }

    @GetMapping("/api/contributors")
    public List<User> resultContributors(@RequestParam(name = repo) String repoName, @RequestParam(name = owner) String ownerName) {
        WebClient client = GitHubClient.built();

        return client.get()
        .uri(uriBuilder -> {
            URI path = uriBuilder.path(String.format("/repos/%1$s/%2$s/contributors", ownerName, repoName)).build();
            System.out.println("PATH: "+path.toString());
            return path;
        })
        .retrieve()
        .onStatus(HttpStatus::is4xxClientError, clientResponse -> {
            System.out.println("4XX Error");
            return Mono.error(new Exception("Error 4XX: Client Error: " + clientResponse.toString()));
        })
        .onStatus(HttpStatus::is5xxServerError, clientResponse -> {
            System.out.println("4XX Error");
            return Mono.error(new Exception("Error 5XX: Server Error: "+clientResponse.toString()));
        })
        .onStatus(HttpStatus::isError, clientResponse -> {
            System.out.println("ERROR");
            return Mono.error(new Exception("ERROR ERROR ERROR"));
        })
        .bodyToFlux(User.class).collectList().block();
    }

//    @GetMapping("/api/loading")
//    public String loadNewContent(@RequestParam(name = repo) String repoName, @RequestParam(name = owner) String ownerName, @RequestParam(name = "id") String dbId) {
//        System.out.println("WHAT");
//        return "{ dbId: \""+dbId+"\", "+repo+": \""+repoName+"\", "+owner+": \""+ownerName+"\"}";
//    }

}
