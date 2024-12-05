package com.db.modeler.service.impl;

import com.db.modeler.entity.Tenant;
import com.db.modeler.mapper.TenantMapper;
import com.db.modeler.mapper.ProjectMapper;
import com.db.modeler.service.TenantService;
import com.db.modeler.exception.ResourceNotFoundException;
import com.db.modeler.exception.ValidationException;
import com.db.modeler.exception.IllegalOperationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class TenantServiceImpl implements TenantService {

    @Autowired
    private TenantMapper tenantMapper;

    @Autowired
    private ProjectMapper projectMapper;

    @Override
    @Transactional
    public Tenant createTenant(Tenant tenant) {
        validateTenant(tenant);
        tenant.setId(UUID.randomUUID());
        tenant.setStatus(Tenant.Status.ACTIVE);
        tenant.setCreatedAt(new Date());
        tenant.setUpdatedAt(new Date());
        tenantMapper.insertTenant(tenant);
        return tenant;
    }

    @Override
    public Tenant getTenantById(UUID id) {
        Tenant tenant = tenantMapper.findTenantById(id);
        if (tenant == null) {
            throw new ResourceNotFoundException("Tenant not found with id: " + id);
        }
        return tenant;
    }

    @Override
    public List<Tenant> getAllTenants() {
        return tenantMapper.findAllTenants();
    }

    @Override
    @Transactional
    public Tenant updateTenant(Tenant tenant) {
        if (tenant.getId() == null) {
            throw new ValidationException("Tenant ID cannot be null");
        }
        
        // Check if tenant exists
        getTenantById(tenant.getId());
        
        validateTenant(tenant);
        tenant.setUpdatedAt(new Date());
        tenantMapper.updateTenant(tenant);
        return tenant;
    }

    @Override
    @Transactional
    public void deleteTenant(UUID id) {
        Tenant tenant = getTenantById(id);
        if (tenant.getStatus() == Tenant.Status.DELETED) {
            throw new IllegalOperationException("Tenant is already deleted");
        }
        
        // Delete associated projects first
        projectMapper.deleteProjectsByTenantId(id);
        
        // Soft delete the tenant
        tenant.setStatus(Tenant.Status.DELETED);
        tenant.setUpdatedAt(new Date());
        tenantMapper.updateTenant(tenant);
    }

    private void validateTenant(Tenant tenant) {
        if (tenant == null) {
            throw new ValidationException("Tenant cannot be null");
        }
        if (!StringUtils.hasText(tenant.getName())) {
            throw new ValidationException("Tenant name cannot be empty");
        }
        if (tenant.getName().length() > 100) {
            throw new ValidationException("Tenant name cannot exceed 100 characters");
        }
        if (tenant.getDescription() != null && tenant.getDescription().length() > 500) {
            throw new ValidationException("Tenant description cannot exceed 500 characters");
        }
    }
}
