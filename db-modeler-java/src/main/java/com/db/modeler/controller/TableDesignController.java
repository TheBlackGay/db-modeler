package com.db.modeler.controller;

import com.db.modeler.entity.TableDesign;
import com.db.modeler.service.TableDesignService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/table-designs")
public class TableDesignController {

    private static final Logger logger = LoggerFactory.getLogger(TableDesignController.class);

    @Autowired
    private TableDesignService tableDesignService;

    @PostMapping
    public ResponseEntity<TableDesign> createTableDesign(@RequestBody TableDesign tableDesign) {
        logger.info("Received request to create table design: {}", tableDesign);
        try {
            TableDesign createdTableDesign = tableDesignService.createTableDesign(tableDesign);
            logger.info("Successfully created table design with ID: {}", createdTableDesign.getId());
            return ResponseEntity.ok(createdTableDesign);
        } catch (Exception e) {
            logger.error("Error creating table design: {}", tableDesign, e);
            throw e;
        }
    }

    @GetMapping("/detail/{id}")
    public ResponseEntity<TableDesign> getTableDesignById(@PathVariable UUID id) {
        logger.info("Received request to get table design by ID: {}", id);
        try {
            TableDesign tableDesign = tableDesignService.getTableDesignById(id);
            if (tableDesign == null) {
                logger.warn("Table design not found with ID: {}", id);
                return ResponseEntity.notFound().build();
            }
            logger.info("Successfully retrieved table design with ID: {}", id);
            return ResponseEntity.ok(tableDesign);
        } catch (Exception e) {
            logger.error("Error getting table design by ID: {}", id, e);
            throw e;
        }
    }

    @GetMapping
    public ResponseEntity<List<TableDesign>> getAllTableDesigns(
            @RequestParam(required = false) UUID projectId) {
        logger.info("Received request to get table designs, projectId: {}", projectId);
        try {
            List<TableDesign> tableDesigns;
            if (projectId != null) {
                tableDesigns = tableDesignService.getTableDesignsByProjectId(projectId);
                logger.info("Successfully retrieved table designs for project: {}", projectId);
            } else {
                tableDesigns = tableDesignService.getAllTableDesigns();
                logger.info("Successfully retrieved all table designs");
            }
            return ResponseEntity.ok(tableDesigns);
        } catch (Exception e) {
            logger.error("Error getting table designs", e);
            throw e;
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<TableDesign> updateTableDesign(@PathVariable UUID id, @RequestBody TableDesign tableDesign) {
        logger.info("Received request to update table design with ID: {}", id);
        try {
            tableDesign.setId(id);
            TableDesign updatedTableDesign = tableDesignService.updateTableDesign(tableDesign);
            logger.info("Successfully updated table design with ID: {}", id);
            return ResponseEntity.ok(updatedTableDesign);
        } catch (Exception e) {
            logger.error("Error updating table design with ID: {}", id, e);
            throw e;
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTableDesign(@PathVariable UUID id) {
        logger.info("Received request to delete table design by ID: {}", id);
        try {
            tableDesignService.deleteTableDesign(id);
            logger.info("Successfully deleted table design with ID: {}", id);
            return ResponseEntity.noContent().build();
        } catch (Exception e) {
            logger.error("Error deleting table design by ID: {}", id, e);
            throw e;
        }
    }

    @PostMapping("/{id}/sync")
    public ResponseEntity<TableDesign> syncToDatabase(@PathVariable UUID id) {
        logger.info("Received request to sync table design to database by ID: {}", id);
        try {
            TableDesign syncedTable = tableDesignService.syncToDatabase(id);
            logger.info("Successfully synced table design to database with ID: {}", id);
            return ResponseEntity.ok(syncedTable);
        } catch (Exception e) {
            logger.error("Error syncing table design to database by ID: {}", id, e);
            throw e;
        }
    }

    @PostMapping("/sync-all")
    public ResponseEntity<List<TableDesign>> syncAllTables() {
        logger.info("Received request to sync all table designs to database");
        try {
            List<TableDesign> syncedTables = tableDesignService.syncAllTables();
            logger.info("Successfully synced all table designs to database");
            return ResponseEntity.ok(syncedTables);
        } catch (Exception e) {
            logger.error("Error syncing all table designs to database", e);
            throw e;
        }
    }

    @GetMapping("/{id}/preview-ddl")
    public ResponseEntity<Map<String, String>> previewDDL(@PathVariable UUID id) {
        logger.info("Received request to preview DDL for table design by ID: {}", id);
        try {
            Map<String, String> ddl = tableDesignService.previewDDL(id);
            logger.info("Successfully previewed DDL for table design with ID: {}", id);
            return ResponseEntity.ok(ddl);
        } catch (Exception e) {
            logger.error("Error previewing DDL for table design by ID: {}", id, e);
            throw e;
        }
    }

    @GetMapping("/preview-all-ddl")
    public ResponseEntity<List<Map<String, String>>> previewAllDDL() {
        logger.info("Received request to preview all DDLs");
        try {
            List<Map<String, String>> ddlList = tableDesignService.previewAllDDL();
            logger.info("Successfully previewed all DDLs");
            return ResponseEntity.ok(ddlList);
        } catch (Exception e) {
            logger.error("Error previewing all DDLs", e);
            throw e;
        }
    }

    @GetMapping("/{id}/detail")
    public ResponseEntity<TableDesign> getTableDesignDetailById(@PathVariable UUID id) {
        TableDesign tableDesign = tableDesignService.getTableDesignById(id);
        if (tableDesign == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(tableDesign);
    }
}
