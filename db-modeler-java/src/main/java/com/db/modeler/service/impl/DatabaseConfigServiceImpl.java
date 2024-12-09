package com.db.modeler.service.impl;

import com.db.modeler.entity.DatabaseConfig;
import com.db.modeler.exception.DatabaseConfigValidationException;
import com.db.modeler.mapper.DatabaseConfigMapper;
import com.db.modeler.service.DatabaseConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.sql.Connection;
import java.sql.DriverManager;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Date;
import java.util.List;
import java.util.UUID;

@Service
public class DatabaseConfigServiceImpl implements DatabaseConfigService {

    @Autowired
    private DatabaseConfigMapper databaseConfigMapper;

    @Override
    @Transactional
    public DatabaseConfig createDatabaseConfig(DatabaseConfig config) {
        validateDatabaseConfig(config);
        
        if (config.getId() == null) {
            config.setId(UUID.randomUUID());
        }
        LocalDateTime now = LocalDateTime.now();
        config.setCreatedAt(Date.from(now.atZone(ZoneId.systemDefault()).toInstant()));
        config.setUpdatedAt(Date.from(now.atZone(ZoneId.systemDefault()).toInstant()));
        config.setStatus(DatabaseConfig.Status.ACTIVE);
        
        databaseConfigMapper.insert(config);
        return config;
    }

    @Override
    public DatabaseConfig getDatabaseConfig(UUID id) {
        if (id == null) {
            throw new DatabaseConfigValidationException("id", "ID cannot be null");
        }
        DatabaseConfig config = databaseConfigMapper.selectById(id);
        if (config == null) {
            throw new DatabaseConfigValidationException("id", "Database configuration not found");
        }
        return config;
    }

    @Override
    public List<DatabaseConfig> getDatabaseConfigsByProjectId(UUID projectId) {
        if (projectId == null) {
            throw new DatabaseConfigValidationException("projectId", "Project ID cannot be null");
        }
        return databaseConfigMapper.selectByProjectId(projectId);
    }

    @Override
    @Transactional
    public DatabaseConfig updateDatabaseConfig(DatabaseConfig config) {
        validateDatabaseConfig(config);
        if (config.getId() == null) {
            throw new DatabaseConfigValidationException("id", "ID cannot be null for update");
        }
        
        // Check if config exists
        DatabaseConfig existingConfig = getDatabaseConfig(config.getId());
        if (existingConfig == null) {
            throw new DatabaseConfigValidationException("id", "Database configuration not found");
        }
        
        config.setUpdatedAt(Date.from(LocalDateTime.now().atZone(ZoneId.systemDefault()).toInstant()));
        databaseConfigMapper.update(config);
        return config;
    }

    @Override
    @Transactional
    public void deleteDatabaseConfig(UUID id) {
        if (id == null) {
            throw new DatabaseConfigValidationException("id", "ID cannot be null");
        }
        DatabaseConfig config = getDatabaseConfig(id);
        if (config == null) {
            throw new DatabaseConfigValidationException("id", "Database configuration not found");
        }
        databaseConfigMapper.deleteById(id);
    }

    @Override
    @Transactional
    public void deleteDatabaseConfigsByProjectId(UUID projectId) {
        if (projectId == null) {
            throw new DatabaseConfigValidationException("projectId", "Project ID cannot be null");
        }
        databaseConfigMapper.deleteByProjectId(projectId);
    }

    @Override
    public boolean testDatabaseConnection(DatabaseConfig config) {
        validateDatabaseConfig(config);
        String url = buildJdbcUrl(config);
        try (Connection conn = DriverManager.getConnection(url, config.getUsername(), config.getPassword())) {
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    private String buildJdbcUrl(DatabaseConfig config) {
        return switch (config.getType()) {
            case MYSQL -> String.format("jdbc:mysql://%s:%d/%s?useSSL=false&serverTimezone=UTC",
                    config.getHost(), config.getPort(), config.getDatabaseName());
            case POSTGRESQL -> String.format("jdbc:postgresql://%s:%d/%s",
                    config.getHost(), config.getPort(), config.getDatabaseName());
            case ORACLE -> String.format("jdbc:oracle:thin:@%s:%d:%s",
                    config.getHost(), config.getPort(), config.getDatabaseName());
            case SQLSERVER -> String.format("jdbc:sqlserver://%s:%d;databaseName=%s",
                    config.getHost(), config.getPort(), config.getDatabaseName());
        };
    }

    private void validateDatabaseConfig(DatabaseConfig config) {
        if (config == null) {
            throw new DatabaseConfigValidationException("config", "Database configuration cannot be null");
        }
        
        if (config.getProjectId() == null) {
            throw new DatabaseConfigValidationException("projectId", "Project ID is required");
        }

        if (!StringUtils.hasText(config.getName())) {
            throw new DatabaseConfigValidationException("name", "Name is required");
        }
        if (config.getName().length() > 100) {
            throw new DatabaseConfigValidationException("name", "Name cannot exceed 100 characters");
        }

        if (config.getDescription() != null && config.getDescription().length() > 500) {
            throw new DatabaseConfigValidationException("description", "Description cannot exceed 500 characters");
        }

        if (config.getType() == null) {
            throw new DatabaseConfigValidationException("type", "Database type is required");
        }

        if (!StringUtils.hasText(config.getHost())) {
            throw new DatabaseConfigValidationException("host", "Host is required");
        }
        if (config.getHost().length() > 255) {
            throw new DatabaseConfigValidationException("host", "Host cannot exceed 255 characters");
        }

        if (config.getPort() <= 0 || config.getPort() > 65535) {
            throw new DatabaseConfigValidationException("port", "Port must be between 1 and 65535");
        }

        if (!StringUtils.hasText(config.getDatabaseName())) {
            throw new DatabaseConfigValidationException("databaseName", "Database name is required");
        }
        if (config.getDatabaseName().length() > 100) {
            throw new DatabaseConfigValidationException("databaseName", "Database name cannot exceed 100 characters");
        }

        if (!StringUtils.hasText(config.getUsername())) {
            throw new DatabaseConfigValidationException("username", "Username is required");
        }
        if (config.getUsername().length() > 100) {
            throw new DatabaseConfigValidationException("username", "Username cannot exceed 100 characters");
        }

        if (!StringUtils.hasText(config.getPassword())) {
            throw new DatabaseConfigValidationException("password", "Password is required");
        }
        if (config.getPassword().length() > 255) {
            throw new DatabaseConfigValidationException("password", "Password cannot exceed 255 characters");
        }
    }
}
