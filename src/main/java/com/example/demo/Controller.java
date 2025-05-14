
    package com.example.demo;

    import org.springframework.web.bind.annotation.GetMapping;
    import org.springframework.web.bind.annotation.RestController;

    @RestController
    public class Controller {

        @GetMapping("/users/{id}")
        public String getUserDetails(String id) {
            return "User details for id: " + id;
        }
    }
    