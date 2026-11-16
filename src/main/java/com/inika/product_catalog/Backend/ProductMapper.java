package com.inika.product_catalog.Backend;

public class ProductMapper {

    private ProductMapper() {
        // utility class — no instances
    }

    public static ProductDTO toDTO(Product updated) {
        if (updated == null) return null;

        ProductDTO dto = new ProductDTO();
        dto.setId(updated.getId());
        dto.setName(updated.getName());
        dto.setDescription(updated.getDescription());
        dto.setCategory(updated.getCategory());
        dto.setPrice(updated.getPrice());
        dto.setStockQuantity(updated.getStockQuantity());
        // costPrice and supplierId deliberately NOT copied
        return dto;
    }

    public static Product toEntity(ProductDTO dto) {
        if (dto == null) return null;

        Product product = new Product();
        product.setName(dto.getName());
        product.setDescription(dto.getDescription());
        product.setCategory(dto.getCategory());
        product.setPrice(dto.getPrice());
        product.setStockQuantity(dto.getStockQuantity());
        // id is DB-generated; costPrice and supplierId stay null (internal only)
        return product;
    }
}