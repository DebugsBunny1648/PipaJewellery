package com.ecommerce.entity;

import com.ecommerce.constant.RoleName;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.util.HashSet;
import java.util.Set;

@Getter
@Setter
@Document(collection = "roles")
public class Role extends BaseEntity {

    @Indexed(unique = true)
    private RoleName name;

    private String description;

    /** References into the `permissions` collection, rather than an embedded/joined object graph. */
    private Set<String> permissionIds = new HashSet<>();
}
