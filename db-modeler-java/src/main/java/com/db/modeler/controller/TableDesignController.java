package com.db.modeler.controller;

import com.db.modeler.entity.TableDesign;
import com.db.modeler.service.TableDesignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/table-designs")
public class TableDesignController {

    @Autowired
    private TableDesignService tableDesignService;

    @PostMapping
    public ResponseEntity<TableDesign> createTableDesign(@RequestBody TableDesign tableDesign) {
        TableDesign createdTableDesign = tableDesignService.createTableDesign(tableDesign);
        return ResponseEntity.ok(createdTableDesign);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TableDesign> getTableDesignById(@PathVariable UUID id) {
        TableDesign tableDesign = tableDesignService.getTableDesignById(id);
        return ResponseEntity.ok(tableDesign);
    }

    @GetMapping
    public ResponseEntity<List<TableDesign>> getAllTableDesigns() {
        List<TableDesign> tableDesigns = tableDesignService.getAllTableDesigns();
        return ResponseEntity.ok(tableDesigns);
    }

    @PutMapping
    public ResponseEntity<TableDesign> updateTableDesign(@RequestBody TableDesign tableDesign) {
        TableDesign updatedTableDesign = tableDesignService.updateTableDesign(tableDesign);
        return ResponseEntity.ok(updatedTableDesign);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTableDesign(@PathVariable UUID id) {
        tableDesignService.deleteTableDesign(id);
        return ResponseEntity.noContent().build();
    }
}
