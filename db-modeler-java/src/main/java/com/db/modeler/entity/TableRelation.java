package com.db.modeler.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.Builder;

import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "表关系实体")
@JsonIgnoreProperties(ignoreUnknown = true)
public class TableRelation {

    @Schema(description = "表关系ID")
    private UUID id;

    @Schema(description = "项目ID")
    private UUID projectId;

    @Schema(description = "源表ID")
    private UUID sourceTableId;

    @Schema(description = "目标表ID")
    private UUID targetTableId;

    @Schema(description = "关系类型")
    private RelationType relationType;

    @Schema(description = "关系描述")
    private String description;

    @Schema(description = "列映射")
    private List<ColumnMapping> columnMappings;

    @Schema(description = "创建时间")
    private Long createdAt;

    @Schema(description = "更新时间")
    private Long updatedAt;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    @Schema(description = "列映射")
    public static class ColumnMapping {
        @Schema(description = "源列ID")
        private UUID sourceColumnId;

        @Schema(description = "目标列ID")
        private UUID targetColumnId;

        @Schema(description = "映射类型")
        private String mappingType;
    }

    public enum RelationType {
        @Schema(description = "一对一关系")
        ONE_TO_ONE,
        
        @Schema(description = "一对多关系")
        ONE_TO_MANY,
        
        @Schema(description = "多对一关系")
        MANY_TO_ONE,
        
        @Schema(description = "多对多关系")
        MANY_TO_MANY,
        
        @Schema(description = "继承关系")
        INHERITANCE,
        
        @Schema(description = "组合关系")
        COMPOSITION,
        
        @Schema(description = "聚合关系")
        AGGREGATION,
        
        @Schema(description = "关联关系")
        ASSOCIATION
    }
}
