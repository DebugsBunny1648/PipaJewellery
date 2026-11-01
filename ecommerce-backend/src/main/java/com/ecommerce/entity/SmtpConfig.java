package com.ecommerce.entity;

import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.mapping.Document;

@Getter
@Setter
@Document(collection = "smtp_configs")
public class SmtpConfig extends BaseEntity {

    private String host;
    private Integer port;
    private String username;

    /** stored encrypted at the service layer, never returned in plaintext via API */
    private String password;

    private boolean useTls = true;
    private boolean useSsl = false;

    private String fromEmail;
    private String fromName;

    private boolean isDefault = false;
}
