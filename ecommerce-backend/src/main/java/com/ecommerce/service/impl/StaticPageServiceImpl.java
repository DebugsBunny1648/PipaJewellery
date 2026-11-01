package com.ecommerce.service.impl;

import com.ecommerce.entity.StaticPage;
import com.ecommerce.exception.DuplicateResourceException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.StaticPageRepository;
import com.ecommerce.service.StaticPageService;
import com.ecommerce.util.SlugUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StaticPageServiceImpl implements StaticPageService {

    private final StaticPageRepository staticPageRepository;

    @Override
    public List<StaticPage> getAll() {
        return staticPageRepository.findAll().stream().filter(p -> !p.isDeleted()).toList();
    }

    @Override
    public StaticPage getBySlug(String slug) {
        return staticPageRepository.findBySlugAndActiveTrueAndDeletedFalse(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Page", "slug", slug));
    }

    @Override
    public StaticPage getById(String id) {
        return find(id);
    }

    @Override
    public StaticPage create(StaticPage page) {
        if (page.getSlug() == null || page.getSlug().isBlank()) {
            page.setSlug(SlugUtil.toSlug(page.getTitle()));
        }
        return staticPageRepository.save(page);
    }

    @Override
    public StaticPage update(String id, StaticPage page) {
        StaticPage existing = find(id);
        page.setId(existing.getId());
        if (page.getSlug() == null || page.getSlug().isBlank()) page.setSlug(existing.getSlug());
        return staticPageRepository.save(page);
    }

    @Override
    public void delete(String id) {
        StaticPage page = find(id);
        page.setDeleted(true);
        staticPageRepository.save(page);
    }

    @Override
    public StaticPage updateStatus(String id, boolean active) {
        StaticPage page = find(id);
        page.setActive(active);
        return staticPageRepository.save(page);
    }

    private StaticPage find(String id) {
        return staticPageRepository.findById(id)
                .filter(p -> !p.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Page", "id", id));
    }
}
