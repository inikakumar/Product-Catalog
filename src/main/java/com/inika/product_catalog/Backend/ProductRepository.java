package com.inika.product_catalog.Backend;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.math.BigDecimal;

public interface ProductRepository extends JpaRepository<Product, Long> {

    Page<Product> findByCategory(String category, Pageable pageable);
    Page<Product> findByPriceLessThan(BigDecimal price, Pageable pageable);
    Page<Product> findByCategoryAndPriceLessThan(String category, BigDecimal price, Pageable pageable);

    boolean existsByName(String name);
    boolean existsByNameAndIdNot(String name, Long id);
}