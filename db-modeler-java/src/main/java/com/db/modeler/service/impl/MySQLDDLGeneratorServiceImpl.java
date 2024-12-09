package com.db.modeler.service.impl;

import com.db.modeler.entity.ColumnDefinition;
import com.db.modeler.entity.TableDesign;
import com.db.modeler.service.DDLGeneratorService;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MySQLDDLGeneratorServiceImpl implements DDLGeneratorService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private ObjectMapper objectMapper;

    @Override
    public String generateCreateTableDDL(TableDesign tableDesign) {
        try {
            List<ColumnDefinition> columns = parseColumns(tableDesign.getColumns());
            if (columns.isEmpty()) {
                throw new IllegalArgumentException("No columns defined for table: " + tableDesign.getCode());
            }

            StringBuilder ddl = new StringBuilder();
            ddl.append("CREATE TABLE ").append(tableDesign.getCode()).append(" (\n");

            // 添加列定义
            List<String> columnDefs = new ArrayList<>();
            List<String> primaryKeys = new ArrayList<>();
            List<String> indexes = new ArrayList<>();

            for (ColumnDefinition column : columns) {
                columnDefs.add(generateColumnDefinition(column));
                if (column.isPrimaryKey()) {
                    primaryKeys.add(column.getCode());
                }
                if (column.getIndexes() != null && !column.getIndexes().isEmpty()) {
                    indexes.addAll(generateIndexDefinitions(tableDesign.getCode(), column));
                }
            }

            // 添加主键约束
            if (!primaryKeys.isEmpty()) {
                columnDefs.add("PRIMARY KEY (" + String.join(", ", primaryKeys) + ")");
            }

            ddl.append(String.join(",\n", columnDefs));
            ddl.append("\n)");

            // 添加表注释
            if (StringUtils.hasText(tableDesign.getComment())) {
                ddl.append(" COMMENT='").append(escapeString(tableDesign.getComment())).append("'");
            }

            ddl.append(";\n");

            // 添加索引
            if (!indexes.isEmpty()) {
                ddl.append("\n").append(String.join(";\n", indexes)).append(";");
            }

            return ddl.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate CREATE TABLE DDL", e);
        }
    }

    @Override
    public String generateAlterTableDDL(TableDesign oldTableDesign, TableDesign newTableDesign) {
        try {
            List<ColumnDefinition> oldColumns = parseColumns(oldTableDesign.getColumns());
            List<ColumnDefinition> newColumns = parseColumns(newTableDesign.getColumns());

            StringBuilder ddl = new StringBuilder();
            ddl.append("ALTER TABLE ").append(oldTableDesign.getCode()).append("\n");

            List<String> alterClauses = new ArrayList<>();

            // 处理列的变更
            for (ColumnDefinition newColumn : newColumns) {
                boolean found = false;
                for (ColumnDefinition oldColumn : oldColumns) {
                    if (oldColumn.getCode().equals(newColumn.getCode())) {
                        found = true;
                        if (!columnsEqual(oldColumn, newColumn)) {
                            alterClauses.add("MODIFY COLUMN " + generateColumnDefinition(newColumn));
                        }
                        break;
                    }
                }
                if (!found) {
                    alterClauses.add("ADD COLUMN " + generateColumnDefinition(newColumn));
                }
            }

            // 处理需要删除的列
            for (ColumnDefinition oldColumn : oldColumns) {
                boolean found = false;
                for (ColumnDefinition newColumn : newColumns) {
                    if (oldColumn.getCode().equals(newColumn.getCode())) {
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    alterClauses.add("DROP COLUMN " + oldColumn.getCode());
                }
            }

            if (alterClauses.isEmpty()) {
                return ""; // 没有变更
            }

            ddl.append(String.join(",\n", alterClauses));
            ddl.append(";");

            return ddl.toString();
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate ALTER TABLE DDL", e);
        }
    }

    @Override
    public void executeDDL(String ddl) {
        if (!StringUtils.hasText(ddl)) {
            return;
        }
        jdbcTemplate.execute(ddl);
    }

    private List<ColumnDefinition> parseColumns(String columnsJson) throws Exception {
        if (!StringUtils.hasText(columnsJson)) {
            return new ArrayList<>();
        }
        return objectMapper.readValue(columnsJson, new TypeReference<List<ColumnDefinition>>() {});
    }

    private String generateColumnDefinition(ColumnDefinition column) {
        StringBuilder def = new StringBuilder();
        def.append(column.getCode()).append(" ");
        def.append(generateDataType(column));

        if (!column.isNullable()) {
            def.append(" NOT NULL");
        }

        if (StringUtils.hasText(column.getDefaultValue())) {
            def.append(" DEFAULT ").append(column.getDefaultValue());
        }

        if (StringUtils.hasText(column.getComment())) {
            def.append(" COMMENT '").append(escapeString(column.getComment())).append("'");
        }

        return def.toString();
    }

    private String generateDataType(ColumnDefinition column) {
        String dataType = column.getDataType().toUpperCase();
        switch (dataType) {
            case "VARCHAR":
            case "CHAR":
                return dataType + "(" + (column.getLength() != null ? column.getLength() : 255) + ")";
            case "DECIMAL":
                return dataType + "(" + 
                    (column.getPrecision() != null ? column.getPrecision() : 10) + "," + 
                    (column.getScale() != null ? column.getScale() : 0) + ")";
            default:
                return dataType;
        }
    }

    private List<String> generateIndexDefinitions(String tableName, ColumnDefinition column) {
        return column.getIndexes().stream()
            .map(indexName -> "CREATE INDEX " + indexName + " ON " + 
                tableName + " (" + column.getCode() + ")")
            .collect(Collectors.toList());
    }

    private boolean columnsEqual(ColumnDefinition col1, ColumnDefinition col2) {
        return col1.getCode().equals(col2.getCode()) &&
               col1.getDataType().equals(col2.getDataType()) &&
               col1.isNullable() == col2.isNullable() &&
               ((col1.getLength() == null && col2.getLength() == null) || 
                (col1.getLength() != null && col1.getLength().equals(col2.getLength()))) &&
               ((col1.getPrecision() == null && col2.getPrecision() == null) || 
                (col1.getPrecision() != null && col1.getPrecision().equals(col2.getPrecision()))) &&
               ((col1.getScale() == null && col2.getScale() == null) || 
                (col1.getScale() != null && col1.getScale().equals(col2.getScale()))) &&
               ((col1.getDefaultValue() == null && col2.getDefaultValue() == null) || 
                (col1.getDefaultValue() != null && col1.getDefaultValue().equals(col2.getDefaultValue()))) &&
               ((col1.getComment() == null && col2.getComment() == null) || 
                (col1.getComment() != null && col1.getComment().equals(col2.getComment())));
    }

    private String escapeString(String str) {
        return str.replace("'", "''");
    }
}
