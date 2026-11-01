package com.ecommerce.service;

public interface EmailService {
    void sendPasswordResetEmail(String toEmail);
    void sendOrderConfirmationEmail(String toEmail, String orderNumber);
    void sendGenericEmail(String toEmail, String subject, String body);
}
