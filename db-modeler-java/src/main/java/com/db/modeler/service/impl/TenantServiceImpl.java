package com.db.modeler.service.impl;

import com.db.modeler.entity.Tenant;
import com.db.modeler.mapper.TenantMapper;
import com.db.modeler.service.TenantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class TenantServiceImpl implements TenantService {

    @Autowired
    private TenantMapper tenantMapper;

    @Override
    @Transactional
    public Tenant createTenant(Tenant tenant) {
        tenant.setId(UUID.randomUUID());
        tenant.setStatus(Tenant.Status.ACTIVE);
        tenant.setCreatedAt(new Date());
        tenant.setUpdatedAt(new Date());
        tenantMapper.insertTenant(tenant);
        return tenant;
    }

    @Override
    public Tenant getTenantById(UUID id) {
        return tenantMapper.findTenantById(id);
    }

    @Override
    public List<Tenant> getAllTenants() {
        return tenantMapper.findAllTenants();
    }

    @Override
    @Transactional
    public Tenant updateTenant(Tenant tenant) {
        tenant.setUpdatedAt(new Date());
        tenantMapper.updateTenant(tenant);
        return tenant;
    }

    @Override
    @Transactional
    public void deleteTenant(UUID id) {
        tenantMapper.deleteTenant(id);
    }
}
