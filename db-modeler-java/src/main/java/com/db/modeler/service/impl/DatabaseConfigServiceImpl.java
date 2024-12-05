package com.db.modeler.service.impl;

import com.db.modeler.entity.DatabaseConfig;
import com.db.modeler.entity.Project;
import com.db.modeler.mapper.DatabaseConfigMapper;
import com.db.modeler.service.DatabaseConfigService;
import com.db.modeler.service.ProjectService;
import com.db.modeler.exception.ResourceNotFoundException;
import com.db.modeler.exception.ValidationException;
import com.db.modeler.exception.IllegalOperationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class DatabaseConfigServiceImpl implements DatabaseConfigService {

    @Autowired
    private DatabaseConfigMapper databaseConfigMapper;

    @Autowired
    private ProjectService projectService;

    @Override
    @Transactional
    public DatabaseConfig createDatabaseConfig(DatabaseConfig config) {
        validateDatabaseConfig(config);
        
        // Verify project exists and is active
        Project project = projectService.getProjectById(config.getProjectId());
        if (project.getStatus() != Project.Status.ACTIVE) {
            throw new IllegalOperationException("Cannot create database config for inactive project");
        }
        
        config.setId(UUID.randomUUID());
        config.setStatus(DatabaseConfig.Status.ACTIVE);
        config.setCreatedAt(new Date());
        config.setUpdatedAt(new Date());
        databaseConfigMapper.insertDatabaseConfig(config);
        return config;
    }

    @Override
    public DatabaseConfig getDatabaseConfigById(UUID id) {
        DatabaseConfig config = databaseConfigMapper.findDatabaseConfigById(id);
        if (config == null) {
            throw new ResourceNotFoundException("Database config not found with id: " + id);
        }
        return config;
    }

    @Override
    public List<DatabaseConfig> getAllDatabaseConfigs() {
        return databaseConfigMapper.findAllDatabaseConfigs();
    }

    @Override
    public List<DatabaseConfig> getDatabaseConfigsByProjectId(UUID projectId) {
        // Verify project exists
        projectService.getProjectById(projectId);
        return databaseConfigMapper.findDatabaseConfigsByProjectId(projectId);
    }

    @Override
    @Transactional
    public DatabaseConfig updateDatabaseConfig(DatabaseConfig config) {
        if (config.getId() == null) {
            throw new ValidationException("Database config ID cannot be null");
        }
        
        // Check if config exists
        DatabaseConfig existingConfig = getDatabaseConfigById(config.getId());
        
        // Verify project exists and is active
        Project project = projectService.getProjectById(config.getProjectId());
        if (project.getStatus() != Project.Status.ACTIVE) {
            throw new IllegalOperationException("Cannot update database config for inactive project");
        }
        
        validateDatabaseConfig(config);
        config.setUpdatedAt(new Date());
        databaseConfigMapper.updateDatabaseConfig(config);
        return config;
    }

    @Override
    @Transactional
    public void deleteDatabaseConfig(UUID id) {
        DatabaseConfig config = getDatabaseConfigById(id);
        if (config.getStatus() == DatabaseConfig.Status.DELETED) {
            throw new IllegalOperationException("Database config is already deleted");
        }
        
        // Soft delete the config
        config.setStatus(DatabaseConfig.Status.DELETED);
        config.setUpdatedAt(new Date());
        databaseConfigMapper.updateDatabaseConfig(config);
    }

    @Override
    public boolean testConnection(DatabaseConfig config) {
        validateDatabaseConfig(config);
        
        String url = buildJdbcUrl(config);
        try {
            // Register JDBC driver based on database type
            switch (config.getType()) {
                case MYSQL:
                    Class.forName("com.mysql.cj.jdbc.Driver");
                    break;
                case POSTGRESQL:
                    Class.forName("org.postgresql.Driver");
                    break;
                case ORACLE:
                    Class.forName("oracle.jdbc.driver.OracleDriver");
                    break;
                case SQLSERVER:
                    Class.forName("com.microsoft.sqlserver.jdbc.SQLServerDriver");
                    break;
                default:
                    throw new IllegalOperationException("Unsupported database type: " + config.getType());
            }
            
            // Try to establish connection
            try (Connection conn = DriverManager.getConnection(url, config.getUsername(), config.getPassword())) {
                return true;
            }
        } catch (Exception e) {
            throw new IllegalOperationException("Failed to connect to database: " + e.getMessage());
        }
    }

    private String buildJdbcUrl(DatabaseConfig config) {
        switch (config.getType()) {
            case MYSQL:
                return String.format("jdbc:mysql://%s:%d/%s", config.getHost(), config.getPort(), config.getDatabaseName());
            case POSTGRESQL:
                return String.format("jdbc:postgresql://%s:%d/%s", config.getHost(), config.getPort(), config.getDatabaseName());
            case ORACLE:
                return String.format("jdbc:oracle:thin:@%s:%d:%s", config.getHost(), config.getPort(), config.getDatabaseName());
            case SQLSERVER:
                return String.format("jdbc:sqlserver://%s:%d;databaseName=%s", config.getHost(), config.getPort(), config.getDatabaseName());
            default:
                throw new IllegalOperationException("Unsupported database type: " + config.getType());
        }
    }

    private void validateDatabaseConfig(DatabaseConfig config) {
        if (config == null) {
            throw new ValidationException("Database config cannot be null");
        }
        if (config.getProjectId() == null) {
            throw new ValidationException("Project ID cannot be null");
        }
        if (!StringUtils.hasText(config.getName())) {
            throw new ValidationException("Database config name cannot be empty");
        }
        if (config.getName().length() > 100) {
            throw new ValidationException("Database config name cannot exceed 100 characters");
        }
        if (config.getDescription() != null && config.getDescription().length() > 500) {
            throw new ValidationException("Database config description cannot exceed 500 characters");
        }
        if (!StringUtils.hasText(config.getHost())) {
            throw new ValidationException("Database host cannot be empty");
        }
        if (config.getPort() == null || config.getPort() <= 0) {
            throw new ValidationException("Invalid database port");
        }
        if (!StringUtils.hasText(config.getDatabaseName())) {
            throw new ValidationException("Database name cannot be empty");
        }
        if (!StringUtils.hasText(config.getUsername())) {
            throw new ValidationException("Database username cannot be empty");
        }
        if (!StringUtils.hasText(config.getPassword())) {
            throw new ValidationException("Database password cannot be empty");
        }
        if (config.getType() == null) {
            throw new ValidationException("Database type cannot be null");
        }
    }
}
