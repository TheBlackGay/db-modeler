package com.db.modeler.service;

import com.db.modeler.entity.TableRelation;
import java.util.List;
import java.util.UUID;

public interface TableRelationService {
    /**
     * 创建表关系
     *
     * @param tableRelation 表关系信息
     * @return 创建的表关系
     */
    TableRelation createTableRelation(TableRelation tableRelation);

    /**
     * 批量创建表关系
     *
     * @param tableRelations 表关系列表
     * @return 创建的表关系列表
     */
    List<TableRelation> createTableRelations(List<TableRelation> tableRelations);

    /**
     * 更新表关系
     *
     * @param tableRelation 更新的表关系信息
     * @return 更新后的表关系
     */
    TableRelation updateTableRelation(TableRelation tableRelation);

    /**
     * 删除表关系
     *
     * @param id 表关系ID
     */
    void deleteTableRelation(UUID id);

    /**
     * 根据ID获取表关系
     *
     * @param id 表关系ID
     * @return 表关系信息
     */
    TableRelation getTableRelationById(UUID id);

    /**
     * 获取项目中的所有表关系
     *
     * @param projectId 项目ID
     * @return 表关系列表
     */
    List<TableRelation> getTableRelationsByProjectId(UUID projectId);

    /**
     * 获取与指定表相关的所有关系
     *
     * @param tableId 表ID
     * @return 表关系列表
     */
    List<TableRelation> getTableRelationsByTableId(UUID tableId);

    /**
     * 获取两个表之间的关系
     *
     * @param table1Id 表1的ID
     * @param table2Id 表2的ID
     * @return 表关系列表
     */
    List<TableRelation> getRelationsBetweenTables(UUID table1Id, UUID table2Id);

    /**
     * 获取项目中指定类型的表关系
     *
     * @param projectId 项目ID
     * @param relationType 关系类型
     * @return 表关系列表
     */
    List<TableRelation> getTableRelationsByType(UUID projectId, TableRelation.RelationType relationType);

    /**
     * 验证表关系的有效性
     *
     * @param tableRelation 表关系信息
     * @return 是否有效
     */
    boolean validateTableRelation(TableRelation tableRelation);

    /**
     * 检查是否存在循环依赖
     *
     * @param projectId 项目ID
     * @param newRelation 新的表关系
     * @return 是否存在循环依赖
     */
    boolean checkCircularDependency(UUID projectId, TableRelation newRelation);
}
