package com.db.modeler.controller;

import com.db.modeler.entity.Database;
import com.db.modeler.service.DatabaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/databases")
public class DatabaseController {

    @Autowired
    private DatabaseService databaseService;

    @PostMapping
    public ResponseEntity<Database> createDatabase(@RequestBody Database database) {
        Database createdDatabase = databaseService.createDatabase(database);
        return ResponseEntity.ok(createdDatabase);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Database> getDatabaseById(@PathVariable UUID id) {
        Database database = databaseService.getDatabaseById(id);
        return ResponseEntity.ok(database);
    }

    @GetMapping
    public ResponseEntity<List<Database>> getAllDatabases() {
        List<Database> databases = databaseService.getAllDatabases();
        return ResponseEntity.ok(databases);
    }

    @PutMapping
    public ResponseEntity<Database> updateDatabase(@RequestBody Database database) {
        Database updatedDatabase = databaseService.updateDatabase(database);
        return ResponseEntity.ok(updatedDatabase);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDatabase(@PathVariable UUID id) {
        databaseService.deleteDatabase(id);
        return ResponseEntity.noContent().build();
    }
}
