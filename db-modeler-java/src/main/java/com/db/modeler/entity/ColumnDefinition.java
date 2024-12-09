package com.db.modeler.entity;

import java.util.List;

public class ColumnDefinition {
    private String code;            // 列代码
    private String displayName;     // 显示名称
    private String dataType;        // 数据类型
    private Integer length;         // 长度
    private Integer precision;      // 精度
    private Integer scale;          // 小数位数
    private boolean nullable;       // 是否可为空
    private String defaultValue;    // 默认值
    private boolean primaryKey;     // 是否为主键
    private String comment;         // 注释
    private List<String> indexes;   // 索引列表

    // Getters and Setters
    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public String getDataType() {
        return dataType;
    }

    public void setDataType(String dataType) {
        this.dataType = dataType;
    }

    public Integer getLength() {
        return length;
    }

    public void setLength(Integer length) {
        this.length = length;
    }

    public Integer getPrecision() {
        return precision;
    }

    public void setPrecision(Integer precision) {
        this.precision = precision;
    }

    public Integer getScale() {
        return scale;
    }

    public void setScale(Integer scale) {
        this.scale = scale;
    }

    public boolean isNullable() {
        return nullable;
    }

    public void setNullable(boolean nullable) {
        this.nullable = nullable;
    }

    public String getDefaultValue() {
        return defaultValue;
    }

    public void setDefaultValue(String defaultValue) {
        this.defaultValue = defaultValue;
    }

    public boolean isPrimaryKey() {
        return primaryKey;
    }

    public void setPrimaryKey(boolean primaryKey) {
        this.primaryKey = primaryKey;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public List<String> getIndexes() {
        return indexes;
    }

    public void setIndexes(List<String> indexes) {
        this.indexes = indexes;
    }
}
