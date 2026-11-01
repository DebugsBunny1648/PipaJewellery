package com.ecommerce.service.impl;

import com.ecommerce.entity.Coupon;
import com.ecommerce.exception.DuplicateResourceException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.CouponRepository;
import com.ecommerce.service.CouponService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CouponServiceImpl implements CouponService {

    private final CouponRepository couponRepository;

    @Override
    public List<Coupon> getAll() {
        return couponRepository.findAll().stream().filter(c -> !c.isDeleted()).toList();
    }

    @Override
    public Coupon getById(String id) {
        return find(id);
    }

    @Override
    public Coupon create(Coupon coupon) {
        couponRepository.findAll().stream()
                .filter(c -> c.getCode().equalsIgnoreCase(coupon.getCode()))
                .findAny()
                .ifPresent(c -> { throw new DuplicateResourceException("Coupon code already exists"); });
        return couponRepository.save(coupon);
    }

    @Override
    public Coupon update(String id, Coupon coupon) {
        Coupon existing = find(id);
        coupon.setId(existing.getId());
        return couponRepository.save(coupon);
    }

    @Override
    public void delete(String id) {
        Coupon coupon = find(id);
        coupon.setDeleted(true);
        couponRepository.save(coupon);
    }

    private Coupon find(String id) {
        return couponRepository.findById(id)
                .filter(c -> !c.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Coupon", "id", id));
    }
}
