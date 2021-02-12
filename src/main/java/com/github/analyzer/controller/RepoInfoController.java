package com.github.analyzer.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.SessionAttributes;

import javax.servlet.http.HttpSession;

@Controller
public class RepoInfoController {
    private static final String repo = "repo";
    private static final String owner = "owner";

    @GetMapping("/repository")
    public String repoInfo(HttpSession attrib, @RequestParam(name = repo) String repoName, @RequestParam(name = owner) String ownerName) {
        //To do something in the future.
//        System.out.println("Repo controller here!");
//        attrib.setAttribute(repo, repoName);
//        attrib.setAttribute(repo, repoName);
        return "repository_info";
    }
}
