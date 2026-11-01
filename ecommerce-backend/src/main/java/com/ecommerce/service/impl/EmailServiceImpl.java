package com.ecommerce.service.impl;

import com.ecommerce.service.EmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Wraps Spring's JavaMailSender, itself configured from the admin-managed SmtpConfig
 * (see SmtpConfigService) rather than only static application.yml values in production.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;

    @Override
    public void sendPasswordResetEmail(String toEmail) {
        // TODO: generate + persist a signed reset token, embed the reset link.
        sendGenericEmail(toEmail, "Reset your password",
                "We received a request to reset your password. This flow is a scaffold — " +
                        "wire up a PasswordResetToken table and a real reset link here.");
    }

    @Override
    public void sendOrderConfirmationEmail(String toEmail, String orderNumber) {
        sendGenericEmail(toEmail, "Order Confirmed: " + orderNumber,
                "Thank you for your order! Your order " + orderNumber + " has been placed successfully.");
    }

    @Override
    public void sendGenericEmail(String toEmail, String subject, String body) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(toEmail);
            message.setSubject(subject);
            message.setText(body);
            mailSender.send(message);
        } catch (Exception ex) {
            // Never let a mail failure break the calling business transaction.
            log.error("Failed to send email to {}: {}", toEmail, ex.getMessage());
        }
    }
}
