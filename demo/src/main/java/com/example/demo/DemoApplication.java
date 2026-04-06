package com.example.demo;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.boot.CommandLineRunner;
import com.example.demo.repository.CategoryRepository;
import com.example.demo.entity.Category;

import java.util.Arrays;

@SpringBootApplication
public class DemoApplication {
	public static void main(String[] args) {
		SpringApplication.run(DemoApplication.class, args);
	}

	@Bean
	public CommandLineRunner initData(CategoryRepository categoryRepository, com.example.demo.repository.UserRepository userRepository) {
		return args -> {
			Arrays.asList("Electronics", "Fashion", "Home/Kitchen Goods", "Personal Care").forEach(name -> {
				if (categoryRepository.findByName(name).isEmpty()) {
					Category category = new Category();
					category.setName(name);
					categoryRepository.save(category);
				}
			});

            userRepository.findByEmail("srinii@gmail.com").ifPresent(user -> {
                if (!"ADMIN".equals(user.getRole())) {
                    user.setRole("ADMIN");
                    userRepository.save(user);
                }
            });
		};
	}
}
