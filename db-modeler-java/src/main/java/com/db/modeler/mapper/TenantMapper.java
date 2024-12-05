package com.db.modeler.mapper;

import com.db.modeler.entity.Tenant;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;
import java.util.UUID;

@Mapper
public interface TenantMapper {
    void insertTenant(Tenant tenant);
    
    Tenant findTenantById(UUID id);
    
    List<Tenant> findAllTenants();
    
    void updateTenant(Tenant tenant);
    
    void deleteTenant(UUID id);
}
