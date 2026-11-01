package com.ecommerce.service.impl;

import com.ecommerce.entity.Customer;
import com.ecommerce.entity.Product;
import com.ecommerce.entity.Review;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.CustomerRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.ReviewRepository;
import com.ecommerce.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;

    @Override
    public List<Review> getByProduct(String productId) {
        return reviewRepository.findByProductIdAndApprovedTrueAndDeletedFalse(productId);
    }

    @Override
    public Review create(String customerId, String productId, int rating, String title, String comment) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product", "id", productId));
        Customer customer = customerRepository.findById(customerId)
                .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", customerId));

        Review review = new Review();
        review.setProductId(product.getId());
        review.setCustomerId(customer.getId());
        review.setRating(rating);
        review.setTitle(title);
        review.setComment(comment);
        review.setApproved(false); // requires admin moderation before it's public
        return reviewRepository.save(review);
    }

    @Override
    public Review approve(String id, boolean approved) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", id));
        review.setApproved(approved);
        return reviewRepository.save(review);
    }

    @Override
    public void delete(String id) {
        Review review = reviewRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Review", "id", id));
        review.setDeleted(true);
        reviewRepository.save(review);
    }
}
