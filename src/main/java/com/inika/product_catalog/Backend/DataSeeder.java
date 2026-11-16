package com.inika.product_catalog.Backend;

import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;

@Component
public class DataSeeder implements CommandLineRunner {

    private final ProductRepository repo;

    public DataSeeder(ProductRepository repo) {
        this.repo = repo;
    }

    @Override
    public void run(String... args) {
        if (repo.count() > 0) {
            System.out.println("DB already has " + repo.count() + " products — skipping seed.");
            return;
        }

        String[] categories = {"Electronics", "Books", "Clothing", "Home", "Sports"};
        Random rnd = new Random(42);
        List<Product> products = new ArrayList<>();

        for (int i = 1; i <= 1000; i++) {
            Product p = new Product();
            String category = categories[i % categories.length];

            p.setName(category + " Item " + i);
            p.setDescription("Seeded product #" + i);
            p.setCategory(category);
            p.setPrice(BigDecimal.valueOf(5 + rnd.nextInt(496)).setScale(2, RoundingMode.HALF_UP));
            p.setStockQuantity(rnd.nextInt(501));
            p.setCostPrice(BigDecimal.valueOf(2 + rnd.nextInt(199)).setScale(2, RoundingMode.HALF_UP));
            p.setSupplierId((long) (1 + rnd.nextInt(20)));

            products.add(p);
        }

        repo.saveAll(products);
        System.out.println("Seeded " + products.size() + " products across " + categories.length + " categories.");
    }
}