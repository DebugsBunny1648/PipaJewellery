package com.ecommerce.security;

import com.ecommerce.entity.AdminUser;
import com.ecommerce.entity.Customer;
import com.ecommerce.entity.Role;
import com.ecommerce.repository.AdminUserRepository;
import com.ecommerce.repository.CustomerRepository;
import com.ecommerce.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final AdminUserRepository adminUserRepository;
    private final CustomerRepository customerRepository;
    private final RoleRepository roleRepository;

    /**
     * Tries to resolve the username as an admin first, then a customer.
     * In practice the JWT filter usually short-circuits via userType claim,
     * this method exists mainly for the initial login form-based lookup.
     */
    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        return adminUserRepository.findByUsernameAndDeletedFalse(username)
                .map(this::toAdminPrincipal)
                .or(() -> adminUserRepository.findByEmailAndDeletedFalse(username).map(this::toAdminPrincipal))
                .or(() -> customerRepository.findByEmailAndDeletedFalse(username).map(UserPrincipal::fromCustomer))
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + username));
    }

    private UserPrincipal toAdminPrincipal(AdminUser admin) {
        Role role = roleRepository.findById(admin.getRoleId())
                .orElseThrow(() -> new UsernameNotFoundException("Role not found for admin: " + admin.getUsername()));
        return UserPrincipal.fromAdmin(admin, role);
    }

    public AdminUser getAdminEntityOrThrow(String usernameOrEmail) {
        return adminUserRepository.findByUsernameAndDeletedFalse(usernameOrEmail)
                .or(() -> adminUserRepository.findByEmailAndDeletedFalse(usernameOrEmail))
                .orElseThrow(() -> new UsernameNotFoundException("Admin not found: " + usernameOrEmail));
    }

    public Customer getCustomerEntityOrThrow(String email) {
        return customerRepository.findByEmailAndDeletedFalse(email)
                .orElseThrow(() -> new UsernameNotFoundException("Customer not found: " + email));
    }
}
