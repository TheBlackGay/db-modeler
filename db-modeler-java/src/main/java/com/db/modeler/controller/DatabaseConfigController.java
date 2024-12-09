package com.db.modeler.controller;

import com.db.modeler.entity.DatabaseConfig;
import com.db.modeler.service.DatabaseConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects/{projectId}/database-configs")
@CrossOrigin(origins = "*")
public class DatabaseConfigController {

    @Autowired
    private DatabaseConfigService databaseConfigService;

    @GetMapping
    public ResponseEntity<List<DatabaseConfig>> getDatabaseConfigs(@PathVariable UUID projectId) {
        List<DatabaseConfig> configs = databaseConfigService.getDatabaseConfigsByProjectId(projectId);
        return ResponseEntity.ok(configs);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DatabaseConfig> getDatabaseConfig(@PathVariable UUID projectId, @PathVariable UUID id) {
        DatabaseConfig config = databaseConfigService.getDatabaseConfig(id);
        return ResponseEntity.ok(config);
    }

    @PostMapping
    public ResponseEntity<DatabaseConfig> createDatabaseConfig(
            @PathVariable UUID projectId,
            @RequestBody DatabaseConfig config) {
        config.setProjectId(projectId);
        DatabaseConfig createdConfig = databaseConfigService.createDatabaseConfig(config);
        return ResponseEntity.ok(createdConfig);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DatabaseConfig> updateDatabaseConfig(
            @PathVariable UUID projectId,
            @PathVariable UUID id,
            @RequestBody DatabaseConfig config) {
        config.setId(id);
        config.setProjectId(projectId);
        DatabaseConfig updatedConfig = databaseConfigService.updateDatabaseConfig(config);
        return ResponseEntity.ok(updatedConfig);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDatabaseConfig(
            @PathVariable UUID projectId,
            @PathVariable UUID id) {
        databaseConfigService.deleteDatabaseConfig(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/test-connection")
    public ResponseEntity<Boolean> testDatabaseConnection(
            @PathVariable UUID projectId,
            @PathVariable UUID id) {
        DatabaseConfig config = databaseConfigService.getDatabaseConfig(id);
        boolean success = databaseConfigService.testDatabaseConnection(config);
        return ResponseEntity.ok(success);
    }
}
