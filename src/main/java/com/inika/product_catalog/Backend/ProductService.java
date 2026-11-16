package com.inika.product_catalog.Backend;
import java.math.BigDecimal;
import java.util.List;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
@Service 
public class ProductService {
    private ProductRepository repo;
    public ProductService(ProductRepository repo)
    {
        this.repo = repo;
    }
    public ProductDTO getById(Long id) {
    Product prod = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
    return ProductMapper.toDTO(prod);
    }
    public ProductDTO create(ProductDTO dto)
    {
        if(repo.existsByName(dto.getName()))
        {
          throw new DuplicateNameException("name already exists: " + dto.getName());
        }
        Product p = ProductMapper.toEntity(dto);
        Product save = repo.save(p);
        return ProductMapper.toDTO(save);
    }
    public ProductDTO update(Long id, ProductDTO dto)
    {
        Product prod = repo.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Product not found: " + id));
        if(repo.existsByNameAndIdNot(dto.getName(),id))
        {
           throw new DuplicateNameException("name already exists: " + dto.getName());

        }
        prod.setName(dto.getName());
        prod.setDescription(dto.getDescription());
        prod.setCategory(dto.getCategory());
        prod.setPrice(dto.getPrice());
        prod.setStockQuantity(dto.getStockQuantity());
        Product saved = repo.save(prod);

        ProductDTO updated = ProductMapper.toDTO(saved);
        return updated;

    }
    public PageResponse<ProductDTO> getProducts(String category, BigDecimal maxPrice, Pageable pageable) {
    Page<Product> page;

    if (category != null && maxPrice != null) {
        page = repo.findByCategoryAndPriceLessThan(category, maxPrice, pageable);
    } else if (category != null) {
        page = repo.findByCategory(category, pageable);
    } else if (maxPrice != null) {
        page = repo.findByPriceLessThan(maxPrice, pageable);
    } else {
        page = repo.findAll(pageable);
    }

    List<ProductDTO> dtos = page.getContent().stream()
            .map(ProductMapper::toDTO)
            .toList();

    return new PageResponse<>(
            dtos,
            page.getNumber(),
            page.getSize(),
            page.getTotalElements(),
            page.getTotalPages(),
            page.isLast()
    );
}

public void delete(Long id) {
    if (!repo.existsById(id)) {
        throw new ResourceNotFoundException("Product not found: " + id);
    }
    repo.deleteById(id);
}

}
