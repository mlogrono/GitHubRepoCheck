package com.github.analyzer;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class AnalyzerApplication {

//    public static void main(String[] args) {
//        SpringApplication.run(AnalyzerApplication.class, args);
//    }

    private static final Logger log = LoggerFactory.getLogger(AnalyzerApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(AnalyzerApplication.class, args);
    }

//    @Bean
//    public RestTemplate restTemplate(RestTemplateBuilder builder) {
//        return builder.build();
//    }
//
//    @Bean
//    public CommandLineRunner run(RestTemplate restTemplate) throws Exception {
////        return args -> {
////            Quote quote = restTemplate.getForObject(
////                    "https://gturnquist-quoters.cfapps.io/api/random", Quote.class);
////            log.info(quote.toString());
////        };
////
////        return null;
////
//        System.out.println("-----------------");
////        return args -> {
////            Repositories repos = restTemplate.getForObject("", Repositories.class);
////            for (Repository repo : repos.getItems()) {
//////                log.info(repo.getName());
////////                log.info(repo.getOwner()+"");
//////                log.info(repo.getDescription());
//////                log.info(repo.getContributorsUrl().toString());
//////                log.info(repo.getCommitsUrl().toString());
////////                private String name;
////////                private Owner owner;
////////                private String description;
////////                private URL contributorsUrl;
////////                private URL commitsUrl;
////            }
////        };
//        return null;
//    }
}
