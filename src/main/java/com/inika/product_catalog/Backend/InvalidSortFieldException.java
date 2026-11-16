package com.inika.product_catalog.Backend;

public class InvalidSortFieldException extends RuntimeException{
    public InvalidSortFieldException(String msg)
    {
        super(msg);
    }
}
