package com.db.modeler.repository;

import com.db.modeler.entity.TableDesign;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Mapper
@Repository
public interface TableDesignRepository {
    TableDesign findById(UUID id);
    List<TableDesign> findAll();
    void save(TableDesign tableDesign);
    void update(TableDesign tableDesign);
    void deleteById(UUID id);
}
