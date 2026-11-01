package com.ecommerce.controller;

import com.ecommerce.dto.request.AddressRequest;
import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.entity.Address;
import com.ecommerce.security.UserPrincipal;
import com.ecommerce.service.AddressService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/addresses")
@RequiredArgsConstructor
@Tag(name = "Addresses")
public class AddressController {

    private final AddressService addressService;

    @GetMapping
    public ApiResponse<List<Address>> getAll(@AuthenticationPrincipal UserPrincipal principal) {
        return ApiResponse.success(addressService.getByCustomer(principal.getId()));
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Address>> create(@AuthenticationPrincipal UserPrincipal principal,
                                                         @Valid @RequestBody AddressRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success("Address added", addressService.create(principal.getId(), request)));
    }

    @PutMapping("/{id}")
    public ApiResponse<Address> update(@AuthenticationPrincipal UserPrincipal principal, @PathVariable String id,
                                        @Valid @RequestBody AddressRequest request) {
        return ApiResponse.success("Address updated", addressService.update(principal.getId(), id, request));
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> delete(@AuthenticationPrincipal UserPrincipal principal, @PathVariable String id) {
        addressService.delete(principal.getId(), id);
        return ApiResponse.success("Address deleted", null);
    }

    @PatchMapping("/{id}/default")
    public ApiResponse<Address> setDefault(@AuthenticationPrincipal UserPrincipal principal, @PathVariable String id) {
        return ApiResponse.success("Default address updated", addressService.setDefault(principal.getId(), id));
    }
}
