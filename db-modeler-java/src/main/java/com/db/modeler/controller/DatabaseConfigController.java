package com.db.modeler.controller;

import com.db.modeler.entity.DatabaseConfig;
import com.db.modeler.service.DatabaseConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/database-configs")
@CrossOrigin(origins = "*")
public class DatabaseConfigController {

    @Autowired
    private DatabaseConfigService databaseConfigService;

    @PostMapping
    public ResponseEntity<DatabaseConfig> createDatabaseConfig(@RequestBody DatabaseConfig config) {
        DatabaseConfig createdConfig = databaseConfigService.createDatabaseConfig(config);
        return ResponseEntity.ok(createdConfig);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DatabaseConfig> getDatabaseConfigById(@PathVariable UUID id) {
        DatabaseConfig config = databaseConfigService.getDatabaseConfigById(id);
        return ResponseEntity.ok(config);
    }

    @GetMapping
    public ResponseEntity<List<DatabaseConfig>> getAllDatabaseConfigs() {
        List<DatabaseConfig> configs = databaseConfigService.getAllDatabaseConfigs();
        return ResponseEntity.ok(configs);
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<DatabaseConfig>> getDatabaseConfigsByProjectId(@PathVariable UUID projectId) {
        List<DatabaseConfig> configs = databaseConfigService.getDatabaseConfigsByProjectId(projectId);
        return ResponseEntity.ok(configs);
    }

    @PutMapping("/{id}")
    public ResponseEntity<DatabaseConfig> updateDatabaseConfig(
            @PathVariable UUID id,
            @RequestBody DatabaseConfig config) {
        config.setId(id);
        DatabaseConfig updatedConfig = databaseConfigService.updateDatabaseConfig(config);
        return ResponseEntity.ok(updatedConfig);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDatabaseConfig(@PathVariable UUID id) {
        databaseConfigService.deleteDatabaseConfig(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/test-connection")
    public ResponseEntity<Boolean> testConnection(@RequestBody DatabaseConfig config) {
        boolean success = databaseConfigService.testConnection(config);
        return ResponseEntity.ok(success);
    }
}
