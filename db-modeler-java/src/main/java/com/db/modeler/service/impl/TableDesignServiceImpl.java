package com.db.modeler.service.impl;

import com.db.modeler.entity.TableDesign;
import com.db.modeler.repository.TableDesignRepository;
import com.db.modeler.service.TableDesignService;
import com.db.modeler.service.DDLGeneratorService;
import com.db.modeler.exception.ResourceNotFoundException;
import com.db.modeler.exception.ValidationException;
import com.db.modeler.exception.DDLExecutionException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.core.JsonProcessingException;
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
import java.util.Arrays;
import java.time.LocalDateTime;

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
        
        // 设置初始值
        tableDesign.setId(UUID.randomUUID());
        tableDesign.setStatus(TableDesign.Status.DRAFT);
        tableDesign.setSynced(false);
        
        // 设置时间戳
        LocalDateTime now = LocalDateTime.now();
        tableDesign.setCreatedAt(now);
        tableDesign.setUpdatedAt(now);
        
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
        
        // 更新时间戳
        existingTableDesign.setUpdatedAt(LocalDateTime.now());
        
        tableDesignRepository.update(existingTableDesign);
        return existingTableDesign;
    }

    @Override
    @Transactional
    public void deleteTableDesign(UUID tableDesignId) {
        getTableDesignById(tableDesignId); // Check if exists
        tableDesignRepository.deleteById(tableDesignId);
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
        
        // 验证元数据格式
        if (StringUtils.hasText(tableDesign.getMetadata())) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode metadata = mapper.readTree(tableDesign.getMetadata());
                
                // 验证必需的元数据字段
                validateMetadataField(metadata, "dbType", "Database type");
                validateMetadataField(metadata, "engine", "Storage engine");
                validateMetadataField(metadata, "charset", "Character set");
                validateMetadataField(metadata, "collate", "Collation");
                
                // 验证字段值的有效性
                validateDbType(metadata.get("dbType").asText());
                validateEngine(metadata.get("engine").asText());
                validateCharset(metadata.get("charset").asText());
                validateCollation(metadata.get("collate").asText());
                
            } catch (JsonProcessingException e) {
                throw new ValidationException("Invalid metadata format: " + e.getMessage());
            }
        }
        
        // 验证列定义格式
        if (StringUtils.hasText(tableDesign.getColumns())) {
            try {
                ObjectMapper mapper = new ObjectMapper();
                JsonNode columns = mapper.readTree(tableDesign.getColumns());
                
                // 验证字段数组
                if (!columns.has("fields") || !columns.get("fields").isArray()) {
                    throw new ValidationException("Fields must be an array");
                }
                
                // 验证索引数组
                if (!columns.has("indexes") || !columns.get("indexes").isArray()) {
                    throw new ValidationException("Indexes must be an array");
                }
                
                // 验证每个字段的必需属性
                JsonNode fields = columns.get("fields");
                for (JsonNode field : fields) {
                    validateFieldDefinition(field);
                }
                
                // 验证每个索引的必需属性
                JsonNode indexes = columns.get("indexes");
                for (JsonNode index : indexes) {
                    validateIndexDefinition(index);
                }
                
            } catch (JsonProcessingException e) {
                throw new ValidationException("Invalid columns format: " + e.getMessage());
            }
        }
    }

    private void validateMetadataField(JsonNode metadata, String fieldName, String displayName) {
        if (!metadata.has(fieldName) || !metadata.get(fieldName).isTextual()) {
            throw new ValidationException(displayName + " is required in metadata");
        }
    }

    private void validateDbType(String dbType) {
        List<String> validDbTypes = Arrays.asList("MYSQL", "POSTGRESQL", "ORACLE", "SQLITE", "SQLSERVER");
        if (!validDbTypes.contains(dbType.toUpperCase())) {
            throw new ValidationException("Invalid database type: " + dbType);
        }
    }

    private void validateEngine(String engine) {
        List<String> validEngines = Arrays.asList("InnoDB", "MyISAM", "Memory", "CSV", "Archive");
        if (!validEngines.stream().anyMatch(e -> e.equalsIgnoreCase(engine))) {
            throw new ValidationException("Invalid storage engine: " + engine);
        }
    }

    private void validateCharset(String charset) {
        List<String> validCharsets = Arrays.asList("utf8mb4", "utf8", "latin1", "gbk");
        if (!validCharsets.contains(charset)) {
            throw new ValidationException("Invalid character set: " + charset);
        }
    }

    private void validateCollation(String collation) {
        List<String> validCollations = Arrays.asList(
            "utf8mb4_general_ci", "utf8mb4_unicode_ci",
            "utf8_general_ci", "latin1_swedish_ci"
        );
        if (!validCollations.contains(collation)) {
            throw new ValidationException("Invalid collation: " + collation);
        }
    }

    private void validateFieldDefinition(JsonNode field) {
        // 验证字段必需属性
        validateRequiredField(field, "name", "Field name");
        validateRequiredField(field, "displayName", "Field display name");
        validateRequiredField(field, "dataType", "Data type");
        
        // 验证数据类型
        String dataType = field.get("dataType").asText();
        validateDataType(dataType);
        
        // 验证长度和精度
        if (needsLength(dataType)) {
            if (!field.has("length") || field.get("length").asInt() <= 0) {
                throw new ValidationException("Length is required for data type: " + dataType);
            }
        }
        
        if (needsPrecision(dataType)) {
            if (!field.has("precision") || field.get("precision").asInt() <= 0) {
                throw new ValidationException("Precision is required for data type: " + dataType);
            }
        }
    }

    private void validateIndexDefinition(JsonNode index) {
        // 验证索引必需属性
        validateRequiredField(index, "name", "Index name");
        validateRequiredField(index, "type", "Index type");
        
        // 验证索引类型
        String indexType = index.get("type").asText();
        List<String> validIndexTypes = Arrays.asList("PRIMARY", "UNIQUE", "INDEX", "FULLTEXT");
        if (!validIndexTypes.contains(indexType)) {
            throw new ValidationException("Invalid index type: " + indexType);
        }
        
        // 验证索引列
        if (!index.has("columns") || !index.get("columns").isArray() || index.get("columns").size() == 0) {
            throw new ValidationException("Index must have at least one column");
        }
    }

    private void validateRequiredField(JsonNode node, String fieldName, String displayName) {
        if (!node.has(fieldName) || node.get(fieldName).isNull() || 
            (node.get(fieldName).isTextual() && node.get(fieldName).asText().trim().isEmpty())) {
            throw new ValidationException(displayName + " is required");
        }
    }

    private boolean needsLength(String dataType) {
        return Arrays.asList("VARCHAR", "CHAR", "BINARY", "VARBINARY").contains(dataType.toUpperCase());
    }

    private boolean needsPrecision(String dataType) {
        return Arrays.asList("DECIMAL", "NUMERIC").contains(dataType.toUpperCase());
    }

    private void validateDataType(String dataType) {
        List<String> validDataTypes = Arrays.asList(
            "INT", "BIGINT", "SMALLINT", "TINYINT",
            "VARCHAR", "CHAR", "TEXT", "LONGTEXT",
            "DECIMAL", "NUMERIC", "FLOAT", "DOUBLE",
            "DATE", "DATETIME", "TIMESTAMP",
            "BINARY", "VARBINARY", "BLOB", "LONGBLOB",
            "BOOLEAN", "ENUM", "SET"
        );
        
        if (!validDataTypes.contains(dataType.toUpperCase())) {
            throw new ValidationException("Invalid data type: " + dataType);
        }
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
