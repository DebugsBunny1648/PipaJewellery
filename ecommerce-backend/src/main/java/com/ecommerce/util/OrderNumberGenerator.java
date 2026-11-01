package com.ecommerce.util;

import java.time.format.DateTimeFormatter;
import java.util.concurrent.ThreadLocalRandom;

public final class OrderNumberGenerator {

    private static final DateTimeFormatter FORMAT = DateTimeFormatter.ofPattern("yyyyMMdd");

    private OrderNumberGenerator() {}

    public static String generate() {
        String datePart = java.time.LocalDate.now().format(FORMAT);
        int random = ThreadLocalRandom.current().nextInt(1000, 9999);
        return "ORD-" + datePart + "-" + random;
    }
}
