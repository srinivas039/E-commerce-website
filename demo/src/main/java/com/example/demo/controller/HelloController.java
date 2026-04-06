package com.example.demo.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.model.User;

@RestController
public class HelloController {
    @GetMapping("/hello")
    public String hello() {
        return "Hello, World!";
    }

    @GetMapping("/welcome")
    public String welcome(@RequestParam String name){
        return "Welcome, " + name;
    }

    @PostMapping("/user")
    public String CreateUser(@RequestBody User user){
        System.out.println(user);
        System.out.println(user.getName());
        return "User " + user.getName() + " was " + user.getAge() + " years old";
    }
    
}
