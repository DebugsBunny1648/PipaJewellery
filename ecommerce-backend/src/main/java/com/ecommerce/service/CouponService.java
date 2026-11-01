package com.ecommerce.service;

import com.ecommerce.entity.Coupon;

import java.util.List;

public interface CouponService {
    List<Coupon> getAll();
    Coupon getById(String id);
    Coupon create(Coupon coupon);
    Coupon update(String id, Coupon coupon);
    void delete(String id);
}
