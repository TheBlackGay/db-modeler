package com.db.modeler.controller;

import com.db.modeler.common.ApiResponse;
import com.db.modeler.entity.Tenant;
import com.db.modeler.service.TenantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/tenants")
@CrossOrigin(origins = "*")
public class TenantController {

    @Autowired
    private TenantService tenantService;

    @PostMapping
    public ApiResponse<Tenant> createTenant(@RequestBody Tenant tenant) {
        if (!isValidTenant(tenant)) {
            return ApiResponse.error("Invalid tenant data");
        }
        try {
            Tenant createdTenant = tenantService.createTenant(tenant);
            return ApiResponse.success(createdTenant);
        } catch (Exception e) {
            return ApiResponse.error("Failed to create tenant: " + e.getMessage());
        }
    }

    @GetMapping("/{id}")
    public ApiResponse<Tenant> getTenantById(@PathVariable UUID id) {
        try {
            Tenant tenant = tenantService.getTenantById(id);
            return ApiResponse.success(tenant);
        } catch (Exception e) {
            return ApiResponse.error("Failed to get tenant: " + e.getMessage());
        }
    }

    @GetMapping
    public ApiResponse<List<Tenant>> getAllTenants() {
        try {
            List<Tenant> tenants = tenantService.getAllTenants();
            return ApiResponse.success(tenants);
        } catch (Exception e) {
            return ApiResponse.error("Failed to get tenants: " + e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ApiResponse<Tenant> updateTenant(@PathVariable UUID id, @RequestBody Tenant tenant) {
        if (!isValidTenant(tenant)) {
            return ApiResponse.error("Invalid tenant data");
        }
        try {
            tenant.setId(id);
            Tenant updatedTenant = tenantService.updateTenant(tenant);
            return ApiResponse.success(updatedTenant);
        } catch (Exception e) {
            return ApiResponse.error("Failed to update tenant: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteTenant(@PathVariable UUID id) {
        try {
            tenantService.deleteTenant(id);
            return ApiResponse.success(null);
        } catch (Exception e) {
            return ApiResponse.error("Failed to delete tenant: " + e.getMessage());
        }
    }

    private boolean isValidTenant(Tenant tenant) {
        return tenant != null &&
               StringUtils.hasText(tenant.getName()) &&
               StringUtils.hasText(tenant.getCode());
    }
}
