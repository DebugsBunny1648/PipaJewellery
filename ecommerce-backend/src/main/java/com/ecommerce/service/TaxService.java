package com.ecommerce.service;

import com.ecommerce.entity.Tax;
import java.util.List;

public interface TaxService {
    List<Tax> getAll();
    Tax getById(String id);
    Tax create(Tax tax);
    Tax update(String id, Tax tax);
    void delete(String id);
}
