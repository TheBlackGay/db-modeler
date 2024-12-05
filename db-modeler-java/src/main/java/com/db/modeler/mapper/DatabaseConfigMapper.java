package com.db.modeler.mapper;

import com.db.modeler.entity.DatabaseConfig;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.UUID;

@Mapper
public interface DatabaseConfigMapper {
    void insertDatabaseConfig(DatabaseConfig config);
    
    DatabaseConfig findDatabaseConfigById(@Param("id") UUID id);
    
    List<DatabaseConfig> findAllDatabaseConfigs();
    
    List<DatabaseConfig> findDatabaseConfigsByProjectId(@Param("projectId") UUID projectId);
    
    void updateDatabaseConfig(DatabaseConfig config);
    
    void deleteDatabaseConfig(@Param("id") UUID id);
    
    void deleteDatabaseConfigsByProjectId(@Param("projectId") UUID projectId);
}
