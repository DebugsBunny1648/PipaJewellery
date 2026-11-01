package com.ecommerce.controller;

import com.ecommerce.constant.DeviceVisibility;
import com.ecommerce.dto.response.ApiResponse;
import com.ecommerce.dto.response.CmsSectionResponse;
import com.ecommerce.service.CmsService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cms")
@RequiredArgsConstructor
@Tag(name = "CMS (public)", description = "Dynamic homepage content for web & mobile")
public class CmsController {

    private final CmsService cmsService;

    @GetMapping("/homepage")
    public ApiResponse<List<CmsSectionResponse>> getHomepage(
            @RequestParam(required = false) DeviceVisibility device) {
        return ApiResponse.success(cmsService.getHomepage(device));
    }
}
