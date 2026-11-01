package com.ecommerce.service;

import com.ecommerce.entity.StaticPage;
import java.util.List;

public interface StaticPageService {
    List<StaticPage> getAll();
    StaticPage getBySlug(String slug);
    StaticPage getById(String id);
    StaticPage create(StaticPage page);
    StaticPage update(String id, StaticPage page);
    void delete(String id);
    StaticPage updateStatus(String id, boolean active);
}
