package com.github.analyzer.controller;


import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.reactive.function.client.WebClient;

@Controller
public class SearchController {
    private static final String query = "query";

    @GetMapping("")
    public String search(@RequestParam(name = query, required = false, defaultValue = "") String queryText) {
        if (!queryText.isBlank()) {
            return String.format("redirect:search?%s=%s", query, queryText);
        } else {
            return "redirect:search";
        }
    }

    @GetMapping(value = {"/search"})
    public String search(@RequestParam(name = query, required = false, defaultValue = "") String queryText, Model model) {
        model.addAttribute(query, queryText);
        return "search";
    }
}
