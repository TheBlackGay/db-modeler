package com.db.modeler.service;

import com.db.modeler.entity.DatabaseConfig;
import com.db.modeler.exception.DatabaseConnectionException;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;
import java.util.UUID;

public interface DatabaseConnectionService {
    /**
     * Initialize a database connection pool for the given configuration
     *
     * @param config The database configuration
     * @return The created data source
     * @throws DatabaseConnectionException if connection creation fails
     */
    DataSource initializeConnection(DatabaseConfig config);

    /**
     * Get an existing data source for the given configuration ID
     *
     * @param configId The configuration ID
     * @return The data source if it exists, null otherwise
     */
    DataSource getDataSource(UUID configId);

    /**
     * Test the database connection using the provided configuration
     *
     * @param config The database configuration to test
     * @return true if connection is successful, false otherwise
     * @throws DatabaseConnectionException if connection test fails
     */
    boolean testConnection(DatabaseConfig config);

    /**
     * Close and remove a database connection pool
     *
     * @param configId The configuration ID
     */
    void closeConnection(UUID configId);

    /**
     * Get a connection from the pool for the given configuration ID
     *
     * @param configId The configuration ID
     * @return A database connection
     * @throws SQLException if connection acquisition fails
     */
    Connection getConnection(UUID configId) throws SQLException;
}
