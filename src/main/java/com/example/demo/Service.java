
    package com.example.demo;

    import org.springframework.stereotype.Service;

    @Service
    public class Service {

        public String getUserAddress(String id) {
            return "User address for id: " + id;
        }
    }
    