package com.ecommerce.service;

import com.ecommerce.dto.request.*;
import com.ecommerce.dto.response.AuthResponse;

public interface AuthService {
    AuthResponse registerCustomer(RegisterRequest request);
    AuthResponse loginCustomer(LoginRequest request);
    AuthResponse loginAdmin(AdminLoginRequest request);
    AuthResponse refreshToken(RefreshTokenRequest request);
    void forgotPassword(ForgotPasswordRequest request);
    void resetPassword(ResetPasswordRequest request);
    void changePassword(String username, String userType, ChangePasswordRequest request);
    void logout(String refreshToken);
}
