package com.ecommerce.security;

import com.ecommerce.entity.AdminUser;
import com.ecommerce.entity.Customer;
import com.ecommerce.entity.Role;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

/**
 * Unified Spring Security principal wrapping either an AdminUser or a Customer,
 * so a single JWT/security pipeline serves both the admin panel and the customer app.
 */
@Getter
public class UserPrincipal implements UserDetails {

    private final String id;
    private final String username;   // email for both admin & customer
    @JsonIgnore
    private final String password;
    private final String userType;   // ADMIN | CUSTOMER
    private final Collection<? extends GrantedAuthority> authorities;
    private final boolean enabled;

    public UserPrincipal(String id, String username, String password, String userType,
                          Collection<? extends GrantedAuthority> authorities, boolean enabled) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.userType = userType;
        this.authorities = authorities;
        this.enabled = enabled;
    }

    /** `role` is resolved separately by the caller since AdminUser only stores a roleId reference. */
    public static UserPrincipal fromAdmin(AdminUser admin, Role role) {
        List<GrantedAuthority> authorities = List.of(
                new SimpleGrantedAuthority("ROLE_" + role.getName().name())
        );
        return new UserPrincipal(admin.getId(), admin.getEmail(), admin.getPassword(),
                "ADMIN", authorities, admin.isActive());
    }

    public static UserPrincipal fromCustomer(Customer customer) {
        List<GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_CUSTOMER"));
        return new UserPrincipal(customer.getId(), customer.getEmail(), customer.getPassword(),
                "CUSTOMER", authorities, customer.isActive());
    }

    @Override public Collection<? extends GrantedAuthority> getAuthorities() { return authorities; }
    @Override public String getPassword() { return password; }
    @Override public String getUsername() { return username; }
    @Override public boolean isAccountNonExpired() { return true; }
    @Override public boolean isAccountNonLocked() { return true; }
    @Override public boolean isCredentialsNonExpired() { return true; }
    @Override public boolean isEnabled() { return enabled; }
}
