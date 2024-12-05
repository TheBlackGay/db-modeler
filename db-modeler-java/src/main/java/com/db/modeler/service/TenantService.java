package com.db.modeler.service;

import com.db.modeler.entity.Tenant;
import java.util.List;
import java.util.UUID;

public interface TenantService {
    /**
     * 创建新租户
     */
    Tenant createTenant(Tenant tenant);
    
    /**
     * 根据ID获取租户
     */
    Tenant getTenantById(UUID id);
    
    /**
     * 获取所有租户
     */
    List<Tenant> getAllTenants();
    
    /**
     * 更新租户信息
     */
    Tenant updateTenant(Tenant tenant);
    
    /**
     * 删除租户
     */
    void deleteTenant(UUID id);
}
