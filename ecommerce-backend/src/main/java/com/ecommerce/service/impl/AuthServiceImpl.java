package com.ecommerce.service.impl;

import com.ecommerce.dto.request.*;
import com.ecommerce.dto.response.AuthResponse;
import com.ecommerce.entity.AdminUser;
import com.ecommerce.entity.Customer;
import com.ecommerce.entity.RefreshToken;
import com.ecommerce.entity.Role;
import com.ecommerce.exception.BadRequestException;
import com.ecommerce.exception.DuplicateResourceException;
import com.ecommerce.exception.ResourceNotFoundException;
import com.ecommerce.exception.UnauthorizedException;
import com.ecommerce.repository.AdminUserRepository;
import com.ecommerce.repository.CustomerRepository;
import com.ecommerce.repository.RefreshTokenRepository;
import com.ecommerce.repository.RoleRepository;
import com.ecommerce.security.JwtTokenProvider;
import com.ecommerce.security.UserPrincipal;
import com.ecommerce.service.AuthService;
import com.ecommerce.service.EmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final CustomerRepository customerRepository;
    private final AdminUserRepository adminUserRepository;
    private final RoleRepository roleRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;
    private final EmailService emailService;

    @Override
    public AuthResponse registerCustomer(RegisterRequest request) {
        if (customerRepository.existsByEmail(request.getEmail())) {
            throw new DuplicateResourceException("An account with this email already exists");
        }
        Customer customer = new Customer();
        customer.setEmail(request.getEmail());
        customer.setFirstName(request.getFirstName());
        customer.setLastName(request.getLastName());
        customer.setPhone(request.getPhone());
        customer.setPassword(passwordEncoder.encode(request.getPassword()));
        Customer saved = customerRepository.save(customer);

        UserPrincipal principal = UserPrincipal.fromCustomer(saved);
        return buildAuthResponse(principal, saved.getFirstName() + " " + emptyIfNull(saved.getLastName()));
    }

    @Override
    public AuthResponse loginCustomer(LoginRequest request) {
        Customer customer = customerRepository.findByEmailAndDeletedFalse(request.getEmail())
                .orElseThrow(() -> new UnauthorizedException("Invalid email or password"));

        if (customer.getPassword() == null || !passwordEncoder.matches(request.getPassword(), customer.getPassword())) {
            throw new UnauthorizedException("Invalid email or password");
        }
        if (!customer.isActive()) {
            throw new UnauthorizedException("This account has been deactivated");
        }
        customer.setLastLoginAt(LocalDateTime.now());
        Customer saved = customerRepository.save(customer);

        UserPrincipal principal = UserPrincipal.fromCustomer(saved);
        return buildAuthResponse(principal, saved.getFirstName() + " " + emptyIfNull(saved.getLastName()));
    }

    @Override
    public AuthResponse loginAdmin(AdminLoginRequest request) {
        AdminUser admin = adminUserRepository.findByUsernameAndDeletedFalse(request.getUsernameOrEmail())
                .or(() -> adminUserRepository.findByEmailAndDeletedFalse(request.getUsernameOrEmail()))
                .orElseThrow(() -> new UnauthorizedException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), admin.getPassword())) {
            throw new UnauthorizedException("Invalid credentials");
        }
        if (!admin.isActive()) {
            throw new UnauthorizedException("This admin account has been deactivated");
        }
        Role role = roleRepository.findById(admin.getRoleId())
                .orElseThrow(() -> new ResourceNotFoundException("Role", "id", admin.getRoleId()));

        admin.setLastLoginAt(LocalDateTime.now());
        AdminUser saved = adminUserRepository.save(admin);

        UserPrincipal principal = UserPrincipal.fromAdmin(saved, role);
        return buildAuthResponse(principal, saved.getFullName());
    }

    @Override
    public AuthResponse refreshToken(RefreshTokenRequest request) {
        RefreshToken stored = refreshTokenRepository.findByTokenAndRevokedFalse(request.getRefreshToken())
                .orElseThrow(() -> new UnauthorizedException("Invalid or expired refresh token"));

        if (stored.getExpiryDate().isBefore(LocalDateTime.now())) {
            throw new UnauthorizedException("Refresh token has expired, please log in again");
        }
        if (!tokenProvider.validateToken(request.getRefreshToken())) {
            throw new UnauthorizedException("Invalid refresh token");
        }

        UserPrincipal principal;
        if ("ADMIN".equals(stored.getUserType())) {
            AdminUser admin = adminUserRepository.findById(stored.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Admin user", "id", stored.getUserId()));
            Role role = roleRepository.findById(admin.getRoleId())
                    .orElseThrow(() -> new ResourceNotFoundException("Role", "id", admin.getRoleId()));
            principal = UserPrincipal.fromAdmin(admin, role);
        } else {
            Customer customer = customerRepository.findById(stored.getUserId())
                    .orElseThrow(() -> new ResourceNotFoundException("Customer", "id", stored.getUserId()));
            principal = UserPrincipal.fromCustomer(customer);
        }

        // rotate refresh token
        stored.setRevoked(true);
        refreshTokenRepository.save(stored);

        return buildAuthResponse(principal, null);
    }

    @Override
    public void forgotPassword(ForgotPasswordRequest request) {
        // In production: generate a signed, short-lived reset token, persist/hash it,
        // and email the reset link via the SmtpConfig-backed mail sender.
        customerRepository.findByEmailAndDeletedFalse(request.getEmail()).ifPresent(customer ->
                emailService.sendPasswordResetEmail(customer.getEmail())
        );
        // Always respond as if it succeeded (avoid user enumeration) — handled at controller level.
    }

    @Override
    public void resetPassword(ResetPasswordRequest request) {
        // Stub: validate resetToken (e.g. via a PasswordResetToken collection or signed JWT), then update password.
        throw new BadRequestException("Reset token validation is not wired to a persistence store in this scaffold. " +
                "Implement PasswordResetToken storage + validation here.");
    }

    @Override
    public void changePassword(String username, String userType, ChangePasswordRequest request) {
        if ("ADMIN".equals(userType)) {
            AdminUser admin = adminUserRepository.findByUsernameAndDeletedFalse(username)
                    .or(() -> adminUserRepository.findByEmailAndDeletedFalse(username))
                    .orElseThrow(() -> new ResourceNotFoundException("Admin user", "username", username));
            if (!passwordEncoder.matches(request.getCurrentPassword(), admin.getPassword())) {
                throw new BadRequestException("Current password is incorrect");
            }
            admin.setPassword(passwordEncoder.encode(request.getNewPassword()));
            adminUserRepository.save(admin);
        } else {
            Customer customer = customerRepository.findByEmailAndDeletedFalse(username)
                    .orElseThrow(() -> new ResourceNotFoundException("Customer", "email", username));
            if (!passwordEncoder.matches(request.getCurrentPassword(), customer.getPassword())) {
                throw new BadRequestException("Current password is incorrect");
            }
            customer.setPassword(passwordEncoder.encode(request.getNewPassword()));
            customerRepository.save(customer);
        }
    }

    @Override
    public void logout(String refreshToken) {
        refreshTokenRepository.findByTokenAndRevokedFalse(refreshToken).ifPresent(rt -> {
            rt.setRevoked(true);
            refreshTokenRepository.save(rt);
        });
    }

    private AuthResponse buildAuthResponse(UserPrincipal principal, String fullName) {
        String accessToken = tokenProvider.generateAccessToken(principal);
        String refreshToken = tokenProvider.generateRefreshToken(principal);

        RefreshToken entity = new RefreshToken();
        entity.setToken(refreshToken);
        entity.setUserId(principal.getId());
        entity.setUserType(principal.getUserType());
        entity.setExpiryDate(LocalDateTime.now().plusSeconds(tokenProvider.getRefreshTokenExpirationMs() / 1000));
        refreshTokenRepository.save(entity);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .tokenType("Bearer")
                .userId(principal.getId())
                .email(principal.getUsername())
                .fullName(fullName)
                .userType(principal.getUserType())
                .roles(principal.getAuthorities().stream().map(Object::toString).toList())
                .build();
    }

    private String emptyIfNull(String s) {
        return s == null ? "" : s;
    }
}
