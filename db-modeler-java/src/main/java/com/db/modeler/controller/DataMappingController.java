package com.db.modeler.controller;

import com.db.modeler.entity.DataMapping;
import com.db.modeler.service.DataMappingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/data-mappings")
public class DataMappingController {

    @Autowired
    private DataMappingService dataMappingService;

    @PostMapping
    public ResponseEntity<DataMapping> createDataMapping(@RequestBody DataMapping dataMapping) {
        DataMapping createdDataMapping = dataMappingService.createDataMapping(dataMapping);
        return ResponseEntity.ok(createdDataMapping);
    }

    @GetMapping("/{id}")
    public ResponseEntity<DataMapping> getDataMappingById(@PathVariable UUID id) {
        DataMapping dataMapping = dataMappingService.getDataMappingById(id);
        return ResponseEntity.ok(dataMapping);
    }

    @GetMapping
    public ResponseEntity<List<DataMapping>> getAllDataMappings() {
        List<DataMapping> dataMappings = dataMappingService.getAllDataMappings();
        return ResponseEntity.ok(dataMappings);
    }

    @PutMapping
    public ResponseEntity<DataMapping> updateDataMapping(@RequestBody DataMapping dataMapping) {
        DataMapping updatedDataMapping = dataMappingService.updateDataMapping(dataMapping);
        return ResponseEntity.ok(updatedDataMapping);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDataMapping(@PathVariable UUID id) {
        dataMappingService.deleteDataMapping(id);
        return ResponseEntity.noContent().build();
    }
}
