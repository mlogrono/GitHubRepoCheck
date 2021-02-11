package com.github.analyzer.controller;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.sql.*;
import java.util.logging.Level;
import java.util.logging.Logger;

@Controller
public class RepoInfoController {
    private static final String repo = "repo";
    private static final String owner = "owner";
    private static final String id = "id";

    @GetMapping(value = {"/repository"})
    public String search(RedirectAttributes attrib, @RequestParam(name = repo) String repoName, @RequestParam(name = owner) String ownerName) {
        String dbUrl = "jdbc:postgresql://localhost:5432/analyzer";
        String user = "postgres";
        String pass = "root";
        int dbId = 0;

        try {
            Connection con = DriverManager.getConnection(dbUrl, user, pass);
            Statement st = con.createStatement();
            ResultSet id = st.executeQuery("SELECT result_id FROM results WHERE query_repo='"+repoName+"' AND query_owner='"+ownerName+"';");
            if (id.next()) {
                System.out.println(">>> OLD ID:" + id.getInt(1));
                dbId = id.getInt(1);
            }
            else {
                boolean rs = st.execute("INSERT INTO results (query_repo, query_owner) VALUES ('" + repoName + "', '" + ownerName + "');");
                id = st.executeQuery("SELECT result_id FROM results WHERE query_repo='" + repoName + "' AND query_owner='" + ownerName + "';");
                if (id.next()) {
                    System.out.println(">>> NEW ID:" + id.getInt(1));
                    dbId = id.getInt(1);
                }
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        //        return "{"+repo+":"+repoName+","+owner+":"+ownerName+"}";
//        attrib.addAttribute(repo, repoName);
//        attrib.addAttribute(owner, ownerName);
//        attrib.addAttribute(id, dbId);
//        return "redirect:api/loading";
        return "repository_info";
    }
}
