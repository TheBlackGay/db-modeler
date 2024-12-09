package com.db.modeler.service.impl;

import com.db.modeler.entity.TableDesign;
import com.db.modeler.repository.TableDesignRepository;
import com.db.modeler.service.TableDesignService;
import com.db.modeler.service.DDLGeneratorService;
import com.db.modeler.exception.ResourceNotFoundException;
import com.db.modeler.exception.ValidationException;
import com.db.modeler.exception.DDLExecutionException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.UUID;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

@Service
public class TableDesignServiceImpl implements TableDesignService {
    
    private static final Logger logger = LoggerFactory.getLogger(TableDesignServiceImpl.class);
    
    @Autowired
    private TableDesignRepository tableDesignRepository;
    
    @Autowired
    private DDLGeneratorService ddlGeneratorService;

    @Override
    @Transactional
    public TableDesign createTableDesign(TableDesign tableDesign) {
        validateTableDesign(tableDesign);
        
        // Check if table with same code exists in the project
        TableDesign existingTable = tableDesignRepository.findByProjectIdAndCode(tableDesign.getProjectId(), tableDesign.getCode());
        if (existingTable != null) {
            throw new ValidationException("Table with code '" + tableDesign.getCode() + "' already exists in this project");
        }
        
        tableDesign.setId(UUID.randomUUID());
        tableDesign.setStatus(TableDesign.Status.DRAFT);
        tableDesign.setSynced(false);
        tableDesignRepository.save(tableDesign);
        
        return tableDesign;
    }

    @Override
    public TableDesign getTableDesignById(UUID tableDesignId) {
        TableDesign tableDesign = tableDesignRepository.findById(tableDesignId);
        if (tableDesign == null) {
            throw new ResourceNotFoundException("Table design not found with id: " + tableDesignId);
        }
        return tableDesign;
    }

    @Override
    public List<TableDesign> getAllTableDesigns() {
        return tableDesignRepository.findAll();
    }

    @Override
    public List<TableDesign> getTableDesignsByProjectId(UUID projectId) {
        return tableDesignRepository.findByProjectId(projectId);
    }

    @Override
    @Transactional
    public TableDesign updateTableDesign(TableDesign tableDesign) {
        validateTableDesign(tableDesign);
        
        TableDesign existingTableDesign = getTableDesignById(tableDesign.getId());
        
        // Update fields
        existingTableDesign.setCode(tableDesign.getCode());
        existingTableDesign.setDisplayName(tableDesign.getDisplayName());
        existingTableDesign.setComment(tableDesign.getComment());
        existingTableDesign.setType(tableDesign.getType());
        existingTableDesign.setDomain(tableDesign.getDomain());
        existingTableDesign.setColumns(tableDesign.getColumns());
        existingTableDesign.setStatus(tableDesign.getStatus());
        existingTableDesign.setMetadata(tableDesign.getMetadata());
        
        // 如果表结构发生变化，需要重置同步状态
        if (!StringUtils.hasText(existingTableDesign.getColumns()) || 
            !existingTableDesign.getColumns().equals(tableDesign.getColumns())) {
            existingTableDesign.setSynced(false);
        }
        
        tableDesignRepository.update(existingTableDesign);
        return existingTableDesign;
    }

    @Override
    @Transactional
    public void deleteTableDesign(UUID tableDesignId) {
        getTableDesignById(tableDesignId); // Check if exists
        tableDesignRepository.deleteById(tableDesignId);
    }

    @Override
    @Transactional
    public TableDesign syncToDatabase(UUID tableDesignId) {
        TableDesign tableDesign = getTableDesignById(tableDesignId);
        
        // 验证表是否可以同步
        validateTableForSync(tableDesign);
        
        try {
            String ddl;
            if (tableDesign.isSynced()) {
                // 如果表已经同步过，生成ALTER TABLE语句
                TableDesign oldTableDesign = getTableDesignById(tableDesignId);
                ddl = ddlGeneratorService.generateAlterTableDDL(oldTableDesign, tableDesign);
            } else {
                // 如果表还未同步，生成CREATE TABLE语句
                ddl = ddlGeneratorService.generateCreateTableDDL(tableDesign);
            }
            
            // 执行DDL
            if (StringUtils.hasText(ddl)) {
                logger.info("Executing DDL for table {}: {}", tableDesign.getCode(), ddl);
                ddlGeneratorService.executeDDL(ddl);
                
                // 更新同步状态
                tableDesign.setSynced(true);
                tableDesignRepository.update(tableDesign);
                
                logger.info("Successfully synchronized table {} to database", tableDesign.getCode());
            } else {
                logger.info("No changes to synchronize for table {}", tableDesign.getCode());
            }
            
            return tableDesign;
        } catch (Exception e) {
            String errorMessage = "Failed to synchronize table " + tableDesign.getCode() + " to database";
            logger.error(errorMessage, e);
            throw new DDLExecutionException(errorMessage, e);
        }
    }

    @Override
    @Transactional
    public List<TableDesign> syncAllTables() {
        List<TableDesign> allTables = getAllTableDesigns();
        for (TableDesign table : allTables) {
            if (!table.isSynced()) {
                try {
                    syncToDatabase(table.getId());
                    logger.info("Successfully synchronized table {} to database", table.getCode());
                } catch (Exception e) {
                    logger.error("Failed to synchronize table {} to database", table.getCode(), e);
                }
            }
        }
        return getAllTableDesigns();
    }
    
    @Override
    public Map<String, String> previewDDL(UUID tableDesignId) {
        TableDesign tableDesign = getTableDesignById(tableDesignId);
        Map<String, String> result = new HashMap<>();
        
        try {
            // 验证表结构
            validateTableForSync(tableDesign);
            
            // 生成DDL
            String ddl;
            if (tableDesign.isSynced()) {
                TableDesign oldTableDesign = getTableDesignById(tableDesignId);
                ddl = ddlGeneratorService.generateAlterTableDDL(oldTableDesign, tableDesign);
                result.put("type", "ALTER");
            } else {
                ddl = ddlGeneratorService.generateCreateTableDDL(tableDesign);
                result.put("type", "CREATE");
            }
            
            result.put("tableName", tableDesign.getCode());
            result.put("ddl", ddl);
            result.put("status", "success");
        } catch (Exception e) {
            result.put("status", "error");
            result.put("error", e.getMessage());
            logger.error("Failed to generate DDL preview for table {}", tableDesign.getCode(), e);
        }
        
        return result;
    }

    @Override
    public List<Map<String, String>> previewAllDDL() {
        List<TableDesign> allTables = getAllTableDesigns();
        List<Map<String, String>> result = new ArrayList<>();
        
        for (TableDesign table : allTables) {
            if (!table.isSynced()) {
                try {
                    Map<String, String> ddlPreview = previewDDL(table.getId());
                    result.add(ddlPreview);
                } catch (Exception e) {
                    Map<String, String> errorResult = new HashMap<>();
                    errorResult.put("tableName", table.getCode());
                    errorResult.put("status", "error");
                    errorResult.put("error", e.getMessage());
                    result.add(errorResult);
                    logger.error("Failed to generate DDL preview for table {}", table.getCode(), e);
                }
            }
        }
        
        return result;
    }
    
    private void validateTableDesign(TableDesign tableDesign) {
        if (tableDesign == null) {
            throw new ValidationException("Table design cannot be null");
        }
        if (!StringUtils.hasText(tableDesign.getCode())) {
            throw new ValidationException("Table code is required");
        }
        if (!StringUtils.hasText(tableDesign.getDisplayName())) {
            throw new ValidationException("Table display name is required");
        }
        if (tableDesign.getType() == null) {
            throw new ValidationException("Table type is required");
        }
        if (tableDesign.getDomain() == null) {
            throw new ValidationException("Table domain is required");
        }
    }

    private void validateTableForSync(TableDesign tableDesign) {
        if (tableDesign.isSynced()) {
            return; // 已经同步过的表不需要重新验证
        }
        
        if (!StringUtils.hasText(tableDesign.getColumns())) {
            throw new ValidationException("Table columns are required for database synchronization");
        }
        
        try {
            // 尝试生成DDL来验证列定义的格式
            ddlGeneratorService.generateCreateTableDDL(tableDesign);
        } catch (Exception e) {
            throw new ValidationException("Invalid column definitions: " + e.getMessage());
        }
    }
}
