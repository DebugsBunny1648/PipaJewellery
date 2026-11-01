package com.ecommerce.util;

import java.text.Normalizer;
import java.util.regex.Pattern;

public final class SlugUtil {

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]+");

    private SlugUtil() {}

    public static String toSlug(String input) {
        if (input == null) return null;
        String noWhitespace = WHITESPACE.matcher(input.trim()).replaceAll("-");
        String normalized = Normalizer.normalize(noWhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("").toLowerCase();
        return slug.replaceAll("-{2,}", "-");
    }
}
