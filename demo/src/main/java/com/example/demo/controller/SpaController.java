package com.example.demo.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class SpaController {

    /**
     * Forward all non-API, non-static frontend routes to index.html
     * so React Router can handle client-side routing.
     */
    @GetMapping(value = {
        "/login", "/signup", "/cart", "/orders",
        "/checkout", "/profile",
        "/product/{id}", "/admin"
    })
    public String forward() {
        return "forward:/index.html";
    }
}
