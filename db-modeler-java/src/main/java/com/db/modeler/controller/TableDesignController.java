package com.db.modeler.controller;

import com.db.modeler.entity.TableDesign;
import com.db.modeler.service.TableDesignService;
import com.db.modeler.common.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ContentDisposition;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/table-designs")
@CrossOrigin(origins = "*")
public class TableDesignController {

    private static final Logger logger = LoggerFactory.getLogger(TableDesignController.class);

    @Autowired
    private TableDesignService tableDesignService;

    @PostMapping
    public ApiResponse<TableDesign> createTableDesign(@RequestBody TableDesign tableDesign) {
        logger.info("Received request to create table design: {}", tableDesign);
        try {
            TableDesign createdTableDesign = tableDesignService.createTableDesign(tableDesign);
            logger.info("Successfully created table design with ID: {}", createdTableDesign.getId());
            return ApiResponse.success(createdTableDesign);
        } catch (Exception e) {
            logger.error("Error creating table design: {}", tableDesign, e);
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping("/detail/{id}")
    public ApiResponse<TableDesign> getTableDesignById(@PathVariable UUID id) {
        logger.info("Received request to get table design by ID: {}", id);
        try {
            TableDesign tableDesign = tableDesignService.getTableDesignById(id);
            if (tableDesign == null) {
                logger.warn("Table design not found with ID: {}", id);
                return ApiResponse.error("Table design not found");
            }
            logger.info("Successfully retrieved table design with ID: {}", id);
            return ApiResponse.success(tableDesign);
        } catch (Exception e) {
            logger.error("Error getting table design by ID: {}", id, e);
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping
    public ApiResponse<List<TableDesign>> getAllTableDesigns(
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
            return ApiResponse.success(tableDesigns);
        } catch (Exception e) {
            logger.error("Error getting table designs", e);
            return ApiResponse.error(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ApiResponse<TableDesign> updateTableDesign(@PathVariable UUID id, @RequestBody TableDesign tableDesign) {
        logger.info("Received request to update table design with ID: {}", id);
        try {
            tableDesign.setId(id);
            TableDesign updatedTableDesign = tableDesignService.updateTableDesign(tableDesign);
            logger.info("Successfully updated table design with ID: {}", id);
            return ApiResponse.success(updatedTableDesign);
        } catch (Exception e) {
            logger.error("Error updating table design with ID: {}", id, e);
            return ApiResponse.error(e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ApiResponse<Void> deleteTableDesign(@PathVariable UUID id) {
        logger.info("Received request to delete table design by ID: {}", id);
        try {
            tableDesignService.deleteTableDesign(id);
            logger.info("Successfully deleted table design with ID: {}", id);
            return ApiResponse.success(null);
        } catch (Exception e) {
            logger.error("Error deleting table design by ID: {}", id, e);
            return ApiResponse.error(e.getMessage());
        }
    }

    @PostMapping("/{id}/sync")
    public ApiResponse<TableDesign> syncToDatabase(@PathVariable UUID id) {
        logger.info("Received request to sync table design to database by ID: {}", id);
        try {
            TableDesign syncedTable = tableDesignService.syncToDatabase(id);
            logger.info("Successfully synced table design to database with ID: {}", id);
            return ApiResponse.success(syncedTable);
        } catch (Exception e) {
            logger.error("Error syncing table design to database by ID: {}", id, e);
            return ApiResponse.error(e.getMessage());
        }
    }

    @PostMapping("/sync-all")
    public ApiResponse<List<TableDesign>> syncAllTables() {
        logger.info("Received request to sync all table designs to database");
        try {
            List<TableDesign> syncedTables = tableDesignService.syncAllTables();
            logger.info("Successfully synced all table designs to database");
            return ApiResponse.success(syncedTables);
        } catch (Exception e) {
            logger.error("Error syncing all table designs to database", e);
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping("/{id}/preview-ddl")
    public ApiResponse<Map<String, String>> previewDDL(@PathVariable UUID id) {
        logger.info("Received request to preview DDL for table design by ID: {}", id);
        try {
            Map<String, String> ddl = tableDesignService.previewDDL(id);
            logger.info("Successfully previewed DDL for table design with ID: {}", id);
            return ApiResponse.success(ddl);
        } catch (Exception e) {
            logger.error("Error previewing DDL for table design by ID: {}", id, e);
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping("/preview-all-ddl")
    public ApiResponse<List<Map<String, String>>> previewAllDDL() {
        logger.info("Received request to preview all DDLs");
        try {
            List<Map<String, String>> ddlList = tableDesignService.previewAllDDL();
            logger.info("Successfully previewed all DDLs");
            return ApiResponse.success(ddlList);
        } catch (Exception e) {
            logger.error("Error previewing all DDLs", e);
            return ApiResponse.error(e.getMessage());
        }
    }

    @GetMapping("/{id}/detail")
    public ApiResponse<TableDesign> getTableDesignDetailById(@PathVariable UUID id) {
        try {
            TableDesign tableDesign = tableDesignService.getTableDesignById(id);
            if (tableDesign == null) {
                return ApiResponse.error("Table design not found");
            }
            return ApiResponse.success(tableDesign);
        } catch (Exception e) {
            logger.error("Error getting table design detail by ID: {}", id, e);
            return ApiResponse.error(e.getMessage());
        }
    }

    @PostMapping("/export")
    public ResponseEntity<byte[]> batchExportTableSql(@RequestBody List<UUID> tableIds) {
        logger.info("Received request to export DDL for tables: {}", tableIds);
        try {
            byte[] content = tableDesignService.batchExportTableSql(tableIds);
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_OCTET_STREAM);
            headers.setContentDisposition(ContentDisposition.builder("attachment")
                .filename("table_ddl_" + LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss")) + ".sql")
                .build());
            
            logger.info("Successfully exported DDL for tables: {}", tableIds);
            return new ResponseEntity<>(content, headers, HttpStatus.OK);
        } catch (Exception e) {
            logger.error("Error exporting DDL for tables: {}", tableIds, e);
            throw e;
        }
    }
}
