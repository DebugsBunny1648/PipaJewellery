package com.ecommerce.config;

import com.ecommerce.constant.RoleName;
import com.ecommerce.entity.*;
import com.ecommerce.repository.AdminUserRepository;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

/**
 * Seeds baseline data so the API is immediately usable after `mvn spring-boot:run`:
 * all 6 roles, a default Super Admin login, and a small jewellery-focused product
 * catalog to demonstrate the generic/dynamic-attribute product model end to end.
 *
 * Safe to run repeatedly — every step checks for existing data first.
 * Disable by removing this bean (or wrapping it behind a `app.seed-data=true` flag)
 * before deploying to a real environment.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final RoleRepository roleRepository;
    private final AdminUserRepository adminUserRepository;
    private final CategoryRepository categoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        seedRoles();
        seedSuperAdmin();
        seedCategoriesAndProducts();
    }

    private void seedRoles() {
        for (RoleName name : RoleName.values()) {
            roleRepository.findByName(name).orElseGet(() -> {
                Role role = new Role();
                role.setName(name);
                role.setDescription("Default seeded role: " + name);
                return roleRepository.save(role);
            });
        }
    }

    private void seedSuperAdmin() {
        if (adminUserRepository.existsByUsername("superadmin")) return;

        Role superAdminRole = roleRepository.findByName(RoleName.SUPER_ADMIN).orElseThrow();
        AdminUser admin = new AdminUser();
        admin.setUsername("superadmin");
        admin.setEmail("superadmin@example.com");
        admin.setPassword(passwordEncoder.encode("ChangeMe123!"));
        admin.setFullName("Platform Super Admin");
        admin.setRoleId(superAdminRole.getId());
        adminUserRepository.save(admin);

        log.info("==================================================================");
        log.info(" Seeded default Super Admin login -> username: superadmin / password: ChangeMe123!");
        log.info(" CHANGE THIS PASSWORD IMMEDIATELY in any non-local environment.");
        log.info("==================================================================");
    }

    private void seedCategoriesAndProducts() {
        if (categoryRepository.count() > 0) return;

        Category rings = category("Rings", "rings", "Engagement, wedding and fashion rings");
        Category necklaces = category("Necklaces", "necklaces", "Chains, pendants and statement necklaces");
        Category earrings = category("Earrings", "earrings", "Studs, hoops and drop earrings");
        Category bangles = category("Bangles", "bangles", "Traditional and contemporary bangles");

        product("Classic Gold Solitaire Ring", "RING-GLD-001", rings, "JEWELLERY",
                new BigDecimal("45999.00"), 12, "Gold", "22K", "6.5g", "Round");
        product("Diamond Halo Engagement Ring", "RING-DIA-002", rings, "JEWELLERY",
                new BigDecimal("128999.00"), 5, "Platinum", "950", "4.2g", "Halo");
        product("Temple Design Gold Necklace", "NCK-GLD-001", necklaces, "JEWELLERY",
                new BigDecimal("89999.00"), 8, "Gold", "22K", "18g", null);
        product("Pearl Drop Earrings", "EAR-PRL-001", earrings, "JEWELLERY",
                new BigDecimal("15999.00"), 20, "Gold", "18K", "3.1g", null);
        product("Kundan Bridal Bangles (Set of 2)", "BNG-KUN-001", bangles, "JEWELLERY",
                new BigDecimal("34999.00"), 10, "Gold Plated", "-", "22g", "2.4 inch");

        log.info("Seeded {} jewellery categories and sample products for demo purposes.",
                categoryRepository.count());
    }

    private Category category(String name, String slug, String description) {
        Category category = new Category();
        category.setName(name);
        category.setSlug(slug);
        category.setDescription(description);
        return categoryRepository.save(category);
    }

    private void product(String name, String sku, Category category, String productType,
                          BigDecimal price, int stock, String material, String purity, String weight, String shape) {
        Product product = new Product();
        product.setName(name);
        product.setSlug(com.ecommerce.util.SlugUtil.toSlug(name));
        product.setSku(sku);
        product.setCategoryId(category.getId());
        product.setProductType(productType);
        product.setPrice(price);
        product.setFinalPrice(price);
        product.setShortDescription(name + " — handcrafted with certified materials.");
        product.setFeatured(true);

        Inventory inventory = new Inventory();
        inventory.setStockQuantity(stock);
        inventory.setLowStockThreshold(3);
        product.setInventory(inventory);

        // Dynamic attributes demonstrate the EAV-style model — none of this is a hardcoded
        // column; a non-jewellery product would simply carry a different set of names.
        List<ProductAttributeValue> attributeValues = new ArrayList<>();
        attributeValues.add(attribute("Material", material));
        if (purity != null) attributeValues.add(attribute("Purity", purity));
        if (weight != null) attributeValues.add(attribute("Weight", weight));
        if (shape != null) attributeValues.add(attribute("Shape", shape));
        product.setAttributeValues(attributeValues);

        productRepository.save(product);
    }

    private ProductAttributeValue attribute(String name, String value) {
        ProductAttributeValue pav = new ProductAttributeValue();
        pav.setAttributeName(name);
        pav.setValue(value);
        return pav;
    }
}
