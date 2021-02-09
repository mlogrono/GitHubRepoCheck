package com.github.analyzer.controller.api;


import io.netty.channel.ChannelOption;
import io.netty.handler.timeout.ReadTimeoutHandler;
import io.netty.handler.timeout.WriteTimeoutHandler;
import org.springframework.http.HttpHeaders;
import org.springframework.http.client.reactive.ReactorClientHttpConnector;
import org.springframework.web.reactive.function.client.ExchangeStrategies;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.netty.http.client.HttpClient;

import java.time.Duration;
import java.util.concurrent.TimeUnit;

public final class GitHubClient {
    private static final HttpClient httpClient;
    private static final WebClient webClient;
    private static final int timeoutMs = 10000;
    private static final String TOKEN = "a3e989b7305567d086ce93177f284c42dff8c775";
    private static final String USER = "mlogrono";

    static {
        httpClient = HttpClient.create()
                .option(ChannelOption.CONNECT_TIMEOUT_MILLIS, timeoutMs)
                .responseTimeout(Duration.ofMillis(timeoutMs))
                .doOnConnected(conn ->
                        conn.addHandlerLast(new ReadTimeoutHandler(timeoutMs, TimeUnit.MILLISECONDS))
                        .addHandlerLast(new WriteTimeoutHandler(timeoutMs, TimeUnit.MILLISECONDS)));

        webClient = WebClient.builder()
                .exchangeStrategies(ExchangeStrategies.builder().codecs(configurer -> configurer
                        .defaultCodecs().maxInMemorySize(16 * 1024 * 1024)).build())
                .baseUrl("https://api.github.com")
                .defaultHeader(HttpHeaders.ACCEPT, "application/vnd.github.v3.json")
                .defaultHeader(HttpHeaders.USER_AGENT, "Spring 5 WebClient")
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Basic "+ USER +":" + TOKEN)
                .clientConnector(new ReactorClientHttpConnector(httpClient))
                .build();
    }

    public static WebClient built() {
        return webClient;
    }
}
