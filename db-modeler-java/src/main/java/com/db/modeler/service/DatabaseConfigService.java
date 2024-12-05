package com.db.modeler.service;

import com.db.modeler.entity.DatabaseConfig;
import java.util.List;
import java.util.UUID;

public interface DatabaseConfigService {
    /**
     * 创建新的数据库配置
     */
    DatabaseConfig createDatabaseConfig(DatabaseConfig config);
    
    /**
     * 根据ID获取数据库配置
     */
    DatabaseConfig getDatabaseConfigById(UUID id);
    
    /**
     * 获取所有数据库配置
     */
    List<DatabaseConfig> getAllDatabaseConfigs();
    
    /**
     * 获取项目下的所有数据库配置
     */
    List<DatabaseConfig> getDatabaseConfigsByProjectId(UUID projectId);
    
    /**
     * 更新数据库配置信息
     */
    DatabaseConfig updateDatabaseConfig(DatabaseConfig config);
    
    /**
     * 删除数据库配置
     */
    void deleteDatabaseConfig(UUID id);
    
    /**
     * 测试数据库连接
     */
    boolean testConnection(DatabaseConfig config);
}
