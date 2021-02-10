package com.github.analyzer.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.json.JSONObject;

import java.util.List;

@JsonIgnoreProperties(ignoreUnknown = true)
public class Repositories {

    @JsonProperty("total_count")
    private int totalCount;

    @JsonProperty("items")
    private List<Repository> items;

    public void setTotalCount(int totalCount) {
        this.totalCount = totalCount;
    }

    public int getTotalCount() {
        return totalCount;
    }

    public void setItems(List<Repository> items) {
        this.items = items;
    }

    public List<Repository> getItems() {
        return items;
    }

    @Override
    public String toString() {
        StringBuilder str = new StringBuilder();
        for(Repository repo: items) {
            str.append(repo.toString()).append(",");
        }
        str = new StringBuilder(str.substring(0, str.toString().lastIndexOf(',')));

        System.out.println("{\"items\": ["+ str +"]}");
        JSONObject jsonObj = new JSONObject("{\"items\": ["+ str +"]}");

//        System.out.println("{ \"total_count\": " + totalCount + ", \"items\": ["+ str +"]}");
//        JSONObject jsonObj = new JSONObject("{ \"total_count\": " + totalCount + ", \"items\": ["+ str +"]}");

//        System.out.println("Pretty Print of JSON:");
//        System.out.println(jsonObj.toString(4)); // pretty print json

        return jsonObj.toString(4);
//        return str.toString();
    }
}