package com.db.modeler.controller;

import com.db.modeler.entity.TableRelation;
import com.db.modeler.service.TableRelationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/table-relations")
@Tag(name = "表关系管理", description = "管理数据库表之间的关系，包括创建、查询、更新和删除操作")
public class TableRelationController {

    private static final Logger logger = LoggerFactory.getLogger(TableRelationController.class);

    @Autowired
    private TableRelationService tableRelationService;

    @Operation(summary = "创建表关系",
            description = "创建两个表之间的关系，包括关系类型和列映射信息")
    @ApiResponse(responseCode = "200", description = "成功创建表关系")
    @PostMapping
    public ResponseEntity<TableRelation> createTableRelation(
            @Parameter(description = "表关系信息") @RequestBody TableRelation tableRelation) {
        logger.info("Creating table relation between tables: {} and {}", 
                   tableRelation.getSourceTableId(), tableRelation.getTargetTableId());
        return ResponseEntity.ok(tableRelationService.createTableRelation(tableRelation));
    }

    @Operation(summary = "批量创建表关系",
            description = "批量创建多个表之间的关系")
    @PostMapping("/batch")
    public ResponseEntity<List<TableRelation>> createTableRelations(
            @Parameter(description = "表关系列表") @RequestBody List<TableRelation> tableRelations) {
        logger.info("Creating {} table relations", tableRelations.size());
        return ResponseEntity.ok(tableRelationService.createTableRelations(tableRelations));
    }

    @Operation(summary = "获取表关系详情",
            description = "根据ID获取表关系的详细信息")
    @GetMapping("/{id}")
    public ResponseEntity<TableRelation> getTableRelation(
            @Parameter(description = "表关系ID") @PathVariable UUID id) {
        logger.info("Getting table relation with id: {}", id);
        return ResponseEntity.ok(tableRelationService.getTableRelationById(id));
    }

    @Operation(summary = "获取项目的所有表关系",
            description = "获取指定项目中的所有表关系")
    @GetMapping("/project/{projectId}")
    public ResponseEntity<List<TableRelation>> getTableRelationsByProject(
            @Parameter(description = "项目ID") @PathVariable UUID projectId) {
        logger.info("Getting all table relations for project: {}", projectId);
        return ResponseEntity.ok(tableRelationService.getTableRelationsByProjectId(projectId));
    }

    @Operation(summary = "获取表的所有关系",
            description = "获取指定表相关的所有关系（作为源表或目标表）")
    @GetMapping("/table/{tableId}")
    public ResponseEntity<List<TableRelation>> getTableRelationsByTable(
            @Parameter(description = "表ID") @PathVariable UUID tableId) {
        logger.info("Getting all relations for table: {}", tableId);
        return ResponseEntity.ok(tableRelationService.getTableRelationsByTableId(tableId));
    }

    @Operation(summary = "获取两个表之间的关系",
            description = "获取两个指定表之间的直接关系")
    @GetMapping("/between")
    public ResponseEntity<List<TableRelation>> getRelationsBetweenTables(
            @Parameter(description = "表1的ID") @RequestParam UUID table1Id,
            @Parameter(description = "表2的ID") @RequestParam UUID table2Id) {
        logger.info("Getting relations between tables: {} and {}", table1Id, table2Id);
        return ResponseEntity.ok(tableRelationService.getRelationsBetweenTables(table1Id, table2Id));
    }

    @Operation(summary = "获取指定类型的表关系",
            description = "获取项目中指定类型的所有表关系")
    @GetMapping("/project/{projectId}/type/{relationType}")
    public ResponseEntity<List<TableRelation>> getTableRelationsByType(
            @Parameter(description = "项目ID") @PathVariable UUID projectId,
            @Parameter(description = "关系类型") @PathVariable TableRelation.RelationType relationType) {
        logger.info("Getting relations of type {} in project {}", relationType, projectId);
        return ResponseEntity.ok(tableRelationService.getTableRelationsByType(projectId, relationType));
    }

    @Operation(summary = "更新表关系",
            description = "更新指定ID的表关系信息")
    @PutMapping("/{id}")
    public ResponseEntity<TableRelation> updateTableRelation(
            @Parameter(description = "表关系ID") @PathVariable UUID id,
            @Parameter(description = "更新的表关系信息") @RequestBody TableRelation tableRelation) {
        logger.info("Updating table relation with id: {}", id);
        tableRelation.setId(id);
        return ResponseEntity.ok(tableRelationService.updateTableRelation(tableRelation));
    }

    @Operation(summary = "删除表关系",
            description = "删除指定ID的表关系")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTableRelation(
            @Parameter(description = "表关系ID") @PathVariable UUID id) {
        logger.info("Deleting table relation with id: {}", id);
        tableRelationService.deleteTableRelation(id);
        return ResponseEntity.noContent().build();
    }

    @Operation(summary = "验证表关系",
            description = "验证表关系的有效性，包括检查表是否存在、列映射是否有效等")
    @PostMapping("/validate")
    public ResponseEntity<Boolean> validateTableRelation(
            @Parameter(description = "待验证的表关系") @RequestBody TableRelation tableRelation) {
        logger.info("Validating table relation between tables: {} and {}", 
                   tableRelation.getSourceTableId(), tableRelation.getTargetTableId());
        return ResponseEntity.ok(tableRelationService.validateTableRelation(tableRelation));
    }

    @Operation(summary = "检查循环依赖",
            description = "检查添加新的表关系是否会导致循环依赖")
    @PostMapping("/check-circular")
    public ResponseEntity<Boolean> checkCircularDependency(
            @Parameter(description = "待检查的表关系") @RequestBody TableRelation tableRelation) {
        logger.info("Checking circular dependency for relation between tables: {} and {}", 
                   tableRelation.getSourceTableId(), tableRelation.getTargetTableId());
        return ResponseEntity.ok(tableRelationService.checkCircularDependency(
            tableRelation.getProjectId(), tableRelation));
    }
}
