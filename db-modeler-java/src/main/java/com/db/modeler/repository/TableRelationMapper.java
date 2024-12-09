package com.db.modeler.repository;

import com.db.modeler.entity.TableRelation;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.UUID;

@Mapper
public interface TableRelationMapper {
    
    /**
     * 插入表关系
     */
    int insert(TableRelation tableRelation);

    /**
     * 插入列映射关系
     */
    int insertColumnMapping(@Param("relationId") UUID relationId, @Param("mapping") TableRelation.ColumnMapping mapping);

    /**
     * 更新表关系
     */
    int update(TableRelation tableRelation);

    /**
     * 删除表关系
     */
    int deleteById(@Param("id") UUID id);

    /**
     * 删除列映射关系
     */
    int deleteColumnMappings(@Param("relationId") UUID relationId);

    /**
     * 根据ID查询表关系
     */
    TableRelation selectById(@Param("id") UUID id);

    /**
     * 查询列映射关系
     */
    List<TableRelation.ColumnMapping> selectColumnMappings(@Param("relationId") UUID relationId);

    /**
     * 根据项目ID查询表关系
     */
    List<TableRelation> selectByProjectId(@Param("projectId") UUID projectId);

    /**
     * 根据源表ID查询表关系
     */
    List<TableRelation> selectBySourceTableId(@Param("sourceTableId") UUID sourceTableId);

    /**
     * 根据目标表ID查询表关系
     */
    List<TableRelation> selectByTargetTableId(@Param("targetTableId") UUID targetTableId);

    /**
     * 查询与指定表相关的所有关系
     */
    List<TableRelation> selectByTableId(@Param("tableId") UUID tableId);

    /**
     * 查询两个表之间的关系
     */
    List<TableRelation> selectRelationsBetweenTables(@Param("table1Id") UUID table1Id, @Param("table2Id") UUID table2Id);

    /**
     * 根据项目ID和关系类型查询表关系
     */
    List<TableRelation> selectByProjectIdAndRelationType(@Param("projectId") UUID projectId, @Param("relationType") TableRelation.RelationType relationType);

    /**
     * 删除项目的所有关系
     */
    int deleteByProjectId(@Param("projectId") UUID projectId);

    /**
     * 删除指定表的所有关系
     */
    int deleteByTableId(@Param("tableId") UUID tableId);
}
