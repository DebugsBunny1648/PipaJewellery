package com.ecommerce.service.impl;

import com.ecommerce.entity.SmtpConfig;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.repository.SmtpConfigRepository;
import com.ecommerce.service.EmailService;
import com.ecommerce.service.SmtpConfigService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SmtpConfigServiceImpl implements SmtpConfigService {

    private final SmtpConfigRepository smtpConfigRepository;
    private final EmailService emailService;

    @Override
    public List<SmtpConfig> getAll() {
        return smtpConfigRepository.findAll().stream().filter(c -> !c.isDeleted()).toList();
    }

    @Override
    public SmtpConfig getActive() {
        return getAll().stream().filter(SmtpConfig::isDefault)
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("No active SMTP configuration found"));
    }

    @Override
    public SmtpConfig create(SmtpConfig config) {
        if (config.isDefault()) clearOtherDefaults();
        return smtpConfigRepository.save(config);
    }

    @Override
    public SmtpConfig update(String id, SmtpConfig config) {
        SmtpConfig existing = find(id);
        config.setId(existing.getId());
        if (config.isDefault()) clearOtherDefaults();
        return smtpConfigRepository.save(config);
    }

    @Override
    public void delete(String id) {
        SmtpConfig config = find(id);
        config.setDeleted(true);
        smtpConfigRepository.save(config);
    }

    @Override
    public void sendTestEmail(String configId, String toEmail) {
        // NOTE: this scaffold uses the single JavaMailSender configured via application.yml.
        // In production, build a JavaMailSenderImpl dynamically from the selected SmtpConfig row.
        emailService.sendGenericEmail(toEmail, "SMTP Test Email",
                "This is a test email confirming your SMTP configuration is working.");
    }

    private void clearOtherDefaults() {
        getAll().forEach(c -> {
            if (c.isDefault()) {
                c.setDefault(false);
                smtpConfigRepository.save(c);
            }
        });
    }

    private SmtpConfig find(String id) {
        return smtpConfigRepository.findById(id)
                .filter(c -> !c.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("SMTP config", "id", id));
    }
}
