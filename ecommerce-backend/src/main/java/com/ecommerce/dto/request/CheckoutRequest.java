package com.ecommerce.dto.request;

import com.ecommerce.constant.PaymentMethod;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CheckoutRequest {

    @NotNull(message = "Shipping address is required")
    private String shippingAddressId;

    @NotNull(message = "Payment method is required")
    private PaymentMethod paymentMethod;

    private String customerNote;
    private String couponCode;
}
