package com.example.demo.controller;

import com.example.demo.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;

@RestController
@RequestMapping("/api/admin/sales")
public class AdminSalesController {

    @Autowired
    private OrderRepository orderRepository;

    @GetMapping
    public ResponseEntity<?> getTotalSales() {
        BigDecimal totalSales = orderRepository.findAll().stream()
                .map(order -> order.getTotalAmount())
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        return ResponseEntity.ok("{\"totalSales\": " + totalSales + "}");
    }
}
