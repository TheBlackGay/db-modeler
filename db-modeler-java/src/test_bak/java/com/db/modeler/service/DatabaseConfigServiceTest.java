package com.db.modeler.service;

import com.db.modeler.entity.DatabaseConfig;
import com.db.modeler.mapper.DatabaseConfigMapper;
import com.db.modeler.service.impl.DatabaseConfigServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Arrays;
import java.util.List;
import java.util.UUID;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class DatabaseConfigServiceTest {

    @Mock
    private DatabaseConfigMapper databaseConfigMapper;

    @InjectMocks
    private DatabaseConfigServiceImpl databaseConfigService;

    private DatabaseConfig testConfig;
    private UUID testId;
    private UUID testProjectId;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        testId = UUID.randomUUID();
        testProjectId = UUID.randomUUID();

        testConfig = new DatabaseConfig();
        testConfig.setId(testId);
        testConfig.setProjectId(testProjectId);
        testConfig.setName("Test Database");
        testConfig.setHost("localhost");
        testConfig.setPort(3306);
        testConfig.setDatabaseName("test_db");
        testConfig.setUsername("test_user");
        testConfig.setPassword("test_password");
        testConfig.setType("MYSQL");
        testConfig.setStatus("ACTIVE");
    }

    @Disabled
    @Test
    void createDatabaseConfig_ShouldCreateNewConfig() {
        // Arrange
        DatabaseConfig inputConfig = new DatabaseConfig();
        inputConfig.setProjectId(testProjectId);
        inputConfig.setName("Test Database");
        inputConfig.setHost("localhost");
        inputConfig.setPort(3306);
        inputConfig.setDatabaseName("test_db");
        inputConfig.setUsername("test_user");
        inputConfig.setPassword("test_password");
        inputConfig.setType("MYSQL");

        // Act
        DatabaseConfig result = databaseConfigService.createDatabaseConfig(inputConfig);

        // Assert
        assertNotNull(result.getId());
        assertEquals("ACTIVE", result.getStatus());
        assertNotNull(result.getCreatedAt());
        assertNotNull(result.getUpdatedAt());
        verify(databaseConfigMapper).insert(any(DatabaseConfig.class));
    }

    @Disabled
    @Test
    void getDatabaseConfig_ShouldReturnConfig() {
        // Arrange
        when(databaseConfigMapper.selectById(testId)).thenReturn(testConfig);

        // Act
        DatabaseConfig result = databaseConfigService.getDatabaseConfig(testId);

        // Assert
        assertNotNull(result);
        assertEquals(testId, result.getId());
        assertEquals(testProjectId, result.getProjectId());
        verify(databaseConfigMapper).selectById(testId);
    }

    @Disabled
    @Test
    void getDatabaseConfigsByProjectId_ShouldReturnConfigList() {
        // Arrange
        List<DatabaseConfig> configs = Arrays.asList(testConfig);
        when(databaseConfigMapper.selectByProjectId(testProjectId)).thenReturn(configs);

        // Act
        List<DatabaseConfig> result = databaseConfigService.getDatabaseConfigsByProjectId(testProjectId);

        // Assert
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals(testId, result.get(0).getId());
        verify(databaseConfigMapper).selectByProjectId(testProjectId);
    }

    @Disabled
    @Test
    void updateDatabaseConfig_ShouldUpdateConfig() {
        // Arrange
        testConfig.setName("Updated Database");

        // Act
        DatabaseConfig result = databaseConfigService.updateDatabaseConfig(testConfig);

        // Assert
        assertNotNull(result);
        assertEquals("Updated Database", result.getName());
        assertNotNull(result.getUpdatedAt());
        verify(databaseConfigMapper).update(testConfig);
    }

    @Disabled
    @Test
    void deleteDatabaseConfig_ShouldDeleteConfig() {
        // Act
        databaseConfigService.deleteDatabaseConfig(testId);

        // Assert
        verify(databaseConfigMapper).deleteById(testId);
    }

    @Disabled
    @Test
    void testDatabaseConnection_ShouldReturnFalseForInvalidConfig() {
        // Act
        boolean result = databaseConfigService.testDatabaseConnection(testConfig);

        // Assert
        assertFalse(result);
    }
}
