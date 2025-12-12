package org.example.foodtruckback.config;

import jakarta.annotation.PostConstruct;

import java.util.TimeZone;

public class TimeConfig {
    @PostConstruct
    public void setDefaultTimeZone() {
        TimeZone.setDefault(TimeZone.getTimeZone("UTC"));
    }
}
