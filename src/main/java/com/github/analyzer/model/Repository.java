package com.github.analyzer.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.net.URL;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Repository {

    @JsonProperty("name")
    private String name;

    @JsonProperty("full_name")
    private String fullName;

    @JsonProperty("owner")
    private User owner;

    @JsonProperty("url")
    private URL url;

    @JsonProperty("forks_count")
    private int forks_count;

    @JsonProperty("stargazers_count")
    private int stargazers_count;

    @JsonProperty("description")
    private String description;

    @JsonProperty("contributors_url")
    private URL contributorsUrl;

    @JsonProperty("commits_url")
    private URL commitsUrl;

    public void setName(String name) {
        this.name = name;
    }

    public String getName() {
        return name;
    }

    public void setFullName(String name) {
        this.fullName = name;
    }

    public String getFullName() {
        return fullName;
    }

    public void setOwner(User owner) {
        this.owner = owner;
    }

    public User getOwner() {
        return owner;
    }

    public void setUrl(URL url) {
        this.url = url;
    }

    public URL getUrl() {
        return url;
    }

    public int getForks_count() {
        return forks_count;
    }

    public void setForks_count(int forks_count) {
        this.forks_count = forks_count;
    }

    public void setStargazers_count(int stargazers_count) {
        this.stargazers_count = stargazers_count;
    }

    public int getStargazers_count() {
        return stargazers_count;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }

    public void setContributorsUrl(URL contributorsUrl) {
        this.contributorsUrl = contributorsUrl;
    }

    public URL getContributorsUrl() {
        return contributorsUrl;
    }

    public void setCommitsUrl(URL commitsUrl) {
        this.commitsUrl = commitsUrl;
    }

    public URL getCommitsUrl() {
        return commitsUrl;
    }

    @Override
    public String toString() {
        return "{ \"name\":\""+name+"\",\"full_name\":\""+fullName+"\",\"owner\":"+owner.toString()+",\"description\":"+(description == null? null : "\""+description+"\"")+",\"contributors_url\":\""+contributorsUrl+"\",\"commits_url\":\""+commitsUrl+"\"}";
//        return "{ \"name\":\""+name+"\",\"full_name\":\""+fullName+"\",\"description\":"+(description == null? null : "\""+description+"\"")+",\"contributors_url\":\""+contributorsUrl+"\",\"commits_url\":\""+commitsUrl+"\"}";
    }
}