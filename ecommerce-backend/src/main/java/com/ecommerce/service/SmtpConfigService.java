package com.ecommerce.service;

import com.ecommerce.entity.SmtpConfig;
import java.util.List;

public interface SmtpConfigService {
    List<SmtpConfig> getAll();
    SmtpConfig getActive();
    SmtpConfig create(SmtpConfig config);
    SmtpConfig update(String id, SmtpConfig config);
    void delete(String id);
    void sendTestEmail(String configId, String toEmail);
}
