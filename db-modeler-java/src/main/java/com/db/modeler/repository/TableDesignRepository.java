package com.db.modeler.repository;

import com.db.modeler.entity.TableDesign;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.UUID;

@Mapper
public interface TableDesignRepository {
    TableDesign findById(UUID id);
    List<TableDesign> findAll();
    void save(TableDesign tableDesign);
    void update(TableDesign tableDesign);
    void deleteById(UUID id);
    TableDesign findByProjectIdAndCode(@Param("projectId") UUID projectId, @Param("code") String code);
    List<TableDesign> findByProjectId(@Param("projectId") UUID projectId);
}
