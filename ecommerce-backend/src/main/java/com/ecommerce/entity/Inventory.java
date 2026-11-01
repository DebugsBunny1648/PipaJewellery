package com.ecommerce.entity;

import lombok.Getter;
import lombok.Setter;

/**
 * Embedded (not a top-level collection) — lives directly on Product. Stock changes and
 * product reads happen together far more often than independently, so co-locating them
 * in one document avoids a join/lookup on every catalog read.
 */
@Getter
@Setter
public class Inventory {
    private Integer stockQuantity = 0;
    private Integer reservedQuantity = 0;
    private Integer lowStockThreshold = 5;
    private String warehouseLocation;
}
