package com.inika.product_catalog.Backend;


public class ResourceNotFoundException extends RuntimeException {
    public ResourceNotFoundException(String msg)
    {
        super(msg);
    }
}
