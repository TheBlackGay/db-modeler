package com.db.modeler.config;

import com.db.modeler.entity.DatabaseConfig;
import com.zaxxer.hikari.HikariConfig;
import com.zaxxer.hikari.HikariDataSource;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class DynamicDataSourceConfig {
    private final Map<UUID, HikariDataSource> dataSources = new ConcurrentHashMap<>();

    public DataSource createDataSource(DatabaseConfig config) {
        HikariConfig hikariConfig = new HikariConfig();
        
        // Set basic properties
        hikariConfig.setJdbcUrl(buildJdbcUrl(config));
        hikariConfig.setUsername(config.getUsername());
        hikariConfig.setPassword(config.getPassword());
        
        // Set pool configuration
        hikariConfig.setMaximumPoolSize(10);
        hikariConfig.setMinimumIdle(5);
        hikariConfig.setIdleTimeout(300000); // 5 minutes
        hikariConfig.setConnectionTimeout(20000); // 20 seconds
        hikariConfig.setMaxLifetime(1200000); // 20 minutes
        
        // Set driver class name based on database type
        String driverClassName = switch (config.getType()) {
            case MYSQL -> "com.mysql.cj.jdbc.Driver";
            case POSTGRESQL -> "org.postgresql.Driver";
            case ORACLE -> "oracle.jdbc.OracleDriver";
            case SQLSERVER -> "com.microsoft.sqlserver.jdbc.SQLServerDriver";
        };
        hikariConfig.setDriverClassName(driverClassName);
        
        // Create and store the data source
        HikariDataSource dataSource = new HikariDataSource(hikariConfig);
        dataSources.put(config.getId(), dataSource);
        
        return dataSource;
    }

    public DataSource getDataSource(UUID configId) {
        return dataSources.get(configId);
    }

    public void removeDataSource(UUID configId) {
        HikariDataSource dataSource = dataSources.remove(configId);
        if (dataSource != null && !dataSource.isClosed()) {
            dataSource.close();
        }
    }

    private String buildJdbcUrl(DatabaseConfig config) {
        return switch (config.getType()) {
            case MYSQL -> String.format("jdbc:mysql://%s:%d/%s", 
                config.getHost(), config.getPort(), config.getDatabaseName());
            case POSTGRESQL -> String.format("jdbc:postgresql://%s:%d/%s",
                config.getHost(), config.getPort(), config.getDatabaseName());
            case ORACLE -> String.format("jdbc:oracle:thin:@%s:%d:%s",
                config.getHost(), config.getPort(), config.getDatabaseName());
            case SQLSERVER -> String.format("jdbc:sqlserver://%s:%d;databaseName=%s",
                config.getHost(), config.getPort(), config.getDatabaseName());
        };
    }
}
