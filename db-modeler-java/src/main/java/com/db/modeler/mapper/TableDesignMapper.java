package com.db.modeler.mapper;

import com.db.modeler.entity.TableDesign;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;
import java.util.UUID;

@Mapper
public interface TableDesignMapper {
    void insertTableDesign(TableDesign tableDesign);
    
    TableDesign findTableDesignById(UUID id);
    
    List<TableDesign> findAllTableDesigns();
    
    void updateTableDesign(TableDesign tableDesign);
    
    void deleteTableDesign(UUID id);
}
