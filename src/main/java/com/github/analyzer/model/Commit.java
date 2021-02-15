package com.github.analyzer.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.net.URL;
import java.util.Date;

//commit ca82a6dff817ec66f44342007202690a93763949
//Author: Scott Chacon <schacon@gee-mail.com>
//Date:   Mon Mar 17 21:52:11 2008 -0700
//
//    Change version number

@JsonIgnoreProperties(ignoreUnknown = true)
public class Commit {

    @JsonProperty("sha")
    private String sha;

    @JsonProperty("commit")
    private GitDetails details;

//    @JsonProperty("date")
//    private String date;
//
//    @JsonProperty("message")
//    private String message;

    @JsonProperty("url")
    private String url;

    @JsonProperty("author")
    private Person author;

    @JsonProperty("committer")
    private Person committer;

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class Person {

        @JsonProperty("login")
        private String login;

        public void setLogin(String login) {
            this.login = login;
        }

        public String getLogin() {
            return login;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class GitDetails {
        @JsonProperty("author")
        private GitPerson author;

        @JsonProperty("committer")
        private GitPerson committer;

        @JsonProperty("message")
        private String message;

        public GitPerson getAuthor() {
            return author;
        }

        public GitPerson getCommitter() {
            return committer;
        }

        public String getMessage() {
            return message;
        }

        public void setAuthor(GitPerson author) {
            this.author = author;
        }

        public void setCommitter(GitPerson committer) {
            this.committer = committer;
        }

        public void setMessage(String message) {
            this.message = message;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class GitPerson {

        @JsonProperty("name")
        private String name;

        @JsonProperty("email")
        private String email;

        @JsonProperty("date")
        private Date date;

        public String getName() {
            return name;
        }

        public String getEmail() {
            return email;
        }

        public Date getDate() {
            return date;
        }

        public void setName(String name) {
            this.name = name;
        }

        public void setEmail(String email) {
            this.email = email;
        }

        public void setDate(Date date) {
            this.date = date;
        }
    }

    public String getSha() {
        return sha;
    }

    public GitDetails getDetails() {
        return details;
    }

//    public String getDate() {
//        return date;
//    }
//
//    public String getMessage() {
//        return message;
//    }

    public String getUrl() {
        return url;
    }

    public Person getAuthor() {
        return author;
    }

    public Person getCommitter() {
        return committer;
    }

    public void setSha(String sha) {
        this.sha = sha;
    }

    public void setDetails(GitDetails details) {
        this.details = details;
    }
//
//    public void setDate(String date) {
//        this.date = date;
//    }
//
//    public void setMessage(String message) {
//        this.message = message;
//    }

    public void setUrl(String url) {
        this.url = url;
    }

    public void setAuthor(Person author) {
        this.author = author;
    }

    public void setCommitter(Person committer) {
        this.committer = committer;
    }
}
