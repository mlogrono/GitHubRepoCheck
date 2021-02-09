package com.github.analyzer.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.net.URL;

@JsonIgnoreProperties(ignoreUnknown = true)
public class User {

    @JsonProperty("login")
    protected String login;

    @JsonProperty("id")
    protected int id;

    @JsonProperty("avatar_url")
    protected URL avatarUrl;

    public String getLogin() {
        return login;
    }

    public void setLogin(String login) {
        this.login = login;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public URL getAvatarUrl() {
        return avatarUrl;
    }

    public void setAvatarUrl(URL avatarUrl) {
        this.avatarUrl = avatarUrl;
    }

    @Override
    public String toString() {
        return "{\"login\":\""+login+"\",\"id\":"+id+",\"avatar_url\":\""+avatarUrl+"\"}";
    }
}
