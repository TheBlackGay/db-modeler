package com.db.modeler.service.impl;

import com.db.modeler.config.DynamicDataSourceConfig;
import com.db.modeler.entity.DatabaseConfig;
import com.db.modeler.exception.DatabaseConnectionException;
import com.db.modeler.service.DatabaseConnectionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class DatabaseConnectionServiceImpl implements DatabaseConnectionService {
    
    private final DynamicDataSourceConfig dataSourceConfig;

    @Override
    public DataSource initializeConnection(DatabaseConfig config) {
        try {
            log.info("Initializing connection pool for database: {}", config.getName());
            return dataSourceConfig.createDataSource(config);
        } catch (Exception e) {
            log.error("Failed to initialize connection pool for database: {}", config.getName(), e);
            throw new DatabaseConnectionException("Failed to initialize database connection", e);
        }
    }

    @Override
    public DataSource getDataSource(UUID configId) {
        DataSource dataSource = dataSourceConfig.getDataSource(configId);
        if (dataSource == null) {
            log.warn("No data source found for config ID: {}", configId);
        }
        return dataSource;
    }

    @Override
    public boolean testConnection(DatabaseConfig config) {
        try {
            DataSource dataSource = dataSourceConfig.createDataSource(config);
            try (Connection conn = dataSource.getConnection()) {
                boolean valid = conn.isValid(5); // 5 seconds timeout
                log.info("Connection test {} for database: {}", 
                    valid ? "successful" : "failed", config.getName());
                return valid;
            }
        } catch (SQLException e) {
            log.error("Connection test failed for database: {}", config.getName(), e);
            throw new DatabaseConnectionException("Failed to test database connection", e);
        } finally {
            // Clean up the test data source
            dataSourceConfig.removeDataSource(config.getId());
        }
    }

    @Override
    public void closeConnection(UUID configId) {
        log.info("Closing connection pool for config ID: {}", configId);
        dataSourceConfig.removeDataSource(configId);
    }

    @Override
    public Connection getConnection(UUID configId) throws SQLException {
        DataSource dataSource = getDataSource(configId);
        if (dataSource == null) {
            throw new DatabaseConnectionException("No data source found for config ID: " + configId);
        }
        try {
            return dataSource.getConnection();
        } catch (SQLException e) {
            log.error("Failed to get connection for config ID: {}", configId, e);
            throw new DatabaseConnectionException("Failed to get database connection", e);
        }
    }
}
