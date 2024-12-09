package com.db.modeler.service.impl;

import com.db.modeler.entity.TableRelation;
import com.db.modeler.repository.TableRelationMapper;
import com.db.modeler.service.TableRelationService;
import com.db.modeler.service.TableDesignService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;

@Service
public class TableRelationServiceImpl implements TableRelationService {

    @Autowired
    private TableRelationMapper tableRelationMapper;

    @Autowired
    private TableDesignService tableDesignService;

    @Override
    @Transactional
    public TableRelation createTableRelation(TableRelation tableRelation) {
        // 验证关系的有效性
        if (!validateTableRelation(tableRelation)) {
            throw new IllegalArgumentException("Invalid table relation");
        }

        // 检查循环依赖
        if (checkCircularDependency(tableRelation.getProjectId(), tableRelation)) {
            throw new IllegalStateException("Circular dependency detected");
        }

        // 设置创建时间和更新时间
        long currentTime = System.currentTimeMillis();
        tableRelation.setCreatedAt(currentTime);
        tableRelation.setUpdatedAt(currentTime);

        // 生成UUID
        if (tableRelation.getId() == null) {
            tableRelation.setId(UUID.randomUUID());
        }

        // 插入主记录
        tableRelationMapper.insert(tableRelation);

        // 插入列映射
        if (tableRelation.getColumnMappings() != null) {
            for (TableRelation.ColumnMapping mapping : tableRelation.getColumnMappings()) {
                tableRelationMapper.insertColumnMapping(tableRelation.getId(), mapping);
            }
        }

        return tableRelation;
    }

    @Override
    @Transactional
    public TableRelation updateTableRelation(TableRelation tableRelation) {
        // 验证关系是否存在
        TableRelation existing = tableRelationMapper.selectById(tableRelation.getId());
        if (existing == null) {
            throw new NoSuchElementException("Table relation not found");
        }

        // 验证关系的有效性
        if (!validateTableRelation(tableRelation)) {
            throw new IllegalArgumentException("Invalid table relation");
        }

        // 检查循环依赖
        if (checkCircularDependency(tableRelation.getProjectId(), tableRelation)) {
            throw new IllegalStateException("Circular dependency detected");
        }

        // 更新时间
        tableRelation.setUpdatedAt(System.currentTimeMillis());

        // 更新主记录
        tableRelationMapper.update(tableRelation);

        // 更新列映射
        tableRelationMapper.deleteColumnMappings(tableRelation.getId());
        if (tableRelation.getColumnMappings() != null) {
            for (TableRelation.ColumnMapping mapping : tableRelation.getColumnMappings()) {
                tableRelationMapper.insertColumnMapping(tableRelation.getId(), mapping);
            }
        }

        return tableRelation;
    }

    @Override
    @Transactional
    public void deleteTableRelation(UUID id) {
        // 先删除列映射
        tableRelationMapper.deleteColumnMappings(id);
        // 再删除主记录
        tableRelationMapper.deleteById(id);
    }

    @Override
    public TableRelation getTableRelationById(UUID id) {
        TableRelation relation = tableRelationMapper.selectById(id);
        if (relation == null) {
            throw new NoSuchElementException("Table relation not found");
        }
        return relation;
    }

    @Override
    public List<TableRelation> getTableRelationsByProjectId(UUID projectId) {
        return tableRelationMapper.selectByProjectId(projectId);
    }

    @Override
    public List<TableRelation> getTableRelationsByTableId(UUID tableId) {
        return tableRelationMapper.selectByTableId(tableId);
    }

    @Override
    public List<TableRelation> getRelationsBetweenTables(UUID table1Id, UUID table2Id) {
        return tableRelationMapper.selectRelationsBetweenTables(table1Id, table2Id);
    }

    @Override
    public List<TableRelation> getTableRelationsByType(UUID projectId, TableRelation.RelationType relationType) {
        return tableRelationMapper.selectByProjectIdAndRelationType(projectId, relationType);
    }

    @Override
    @Transactional
    public List<TableRelation> createTableRelations(List<TableRelation> tableRelations) {
        List<TableRelation> createdRelations = new ArrayList<>();
        for (TableRelation relation : tableRelations) {
            createdRelations.add(createTableRelation(relation));
        }
        return createdRelations;
    }

    @Override
    public boolean validateTableRelation(TableRelation tableRelation) {
        // 检查必要字段
        if (tableRelation.getProjectId() == null ||
            tableRelation.getSourceTableId() == null ||
            tableRelation.getTargetTableId() == null ||
            tableRelation.getRelationType() == null) {
            return false;
        }

        // 检查源表和目标表是否存在
        try {
            tableDesignService.getTableDesignById(tableRelation.getSourceTableId());
            tableDesignService.getTableDesignById(tableRelation.getTargetTableId());
        } catch (NoSuchElementException e) {
            return false;
        }

        return true;
    }

    @Override
    public boolean checkCircularDependency(UUID projectId, TableRelation newRelation) {
        Set<UUID> visited = new HashSet<>();
        Set<UUID> recursionStack = new HashSet<>();
        
        // 获取项目中的所有关系
        List<TableRelation> allRelations = new ArrayList<>(tableRelationMapper.selectByProjectId(projectId));
        
        // 添加新的关系（如果不是更新操作）
        if (newRelation.getId() == null) {
            allRelations.add(newRelation);
        }
        
        // 从源表开始检查是否存在循环依赖
        return hasCircularDependency(newRelation.getSourceTableId(), allRelations, visited, recursionStack);
    }

    private boolean hasCircularDependency(UUID currentTableId,
                                        List<TableRelation> relations,
                                        Set<UUID> visited,
                                        Set<UUID> recursionStack) {
        // 如果当前表已经在递归栈中，说明存在循环依赖
        if (recursionStack.contains(currentTableId)) {
            return true;
        }
        
        // 如果当前表已经访问过且不在递归栈中，说明这条路径没有循环依赖
        if (visited.contains(currentTableId)) {
            return false;
        }
        
        // 将当前表添加到访问集合和递归栈中
        visited.add(currentTableId);
        recursionStack.add(currentTableId);
        
        // 获取当前表作为源表的所有关系
        for (TableRelation relation : relations) {
            if (relation.getSourceTableId().equals(currentTableId)) {
                if (hasCircularDependency(relation.getTargetTableId(), relations, visited, recursionStack)) {
                    return true;
                }
            }
        }
        
        // 回溯时从递归栈中移除当前表
        recursionStack.remove(currentTableId);
        return false;
    }
}
