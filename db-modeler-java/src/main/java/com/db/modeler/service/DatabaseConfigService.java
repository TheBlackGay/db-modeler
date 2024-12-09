package com.db.modeler.service;

import com.db.modeler.entity.DatabaseConfig;
import java.util.List;
import java.util.UUID;

public interface DatabaseConfigService {
    /**
     * 创建数据库配置
     */
    DatabaseConfig createDatabaseConfig(DatabaseConfig config);

    /**
     * 获取数据库配置
     */
    DatabaseConfig getDatabaseConfig(UUID id);

    /**
     * 获取项目的所有数据库配置
     */
    List<DatabaseConfig> getDatabaseConfigsByProjectId(UUID projectId);

    /**
     * 更新数据库配置
     */
    DatabaseConfig updateDatabaseConfig(DatabaseConfig config);

    /**
     * 删除数据库配置
     */
    void deleteDatabaseConfig(UUID id);

    /**
     * 删除项目的所有数据库配置
     */
    void deleteDatabaseConfigsByProjectId(UUID projectId);

    /**
     * 测试数据库连接
     */
    boolean testDatabaseConnection(DatabaseConfig config);
}
