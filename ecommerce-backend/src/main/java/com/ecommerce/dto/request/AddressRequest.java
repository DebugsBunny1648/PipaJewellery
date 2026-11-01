package com.ecommerce.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class AddressRequest {
    private String label;
    @NotBlank
    private String recipientName;
    @NotBlank
    private String phone;
    @NotBlank
    private String addressLine1;
    private String addressLine2;
    @NotBlank
    private String city;
    @NotBlank
    private String state;
    @NotBlank
    private String country;
    @NotBlank
    private String pincode;
    private boolean isDefault;
    private String addressType;
}
