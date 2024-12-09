package com.db.modeler.mapper;

import com.db.modeler.entity.DataMapping;
import org.apache.ibatis.annotations.Mapper;
import java.util.List;
import java.util.UUID;

@Mapper
public interface DataMappingMapper {
    void insertDataMapping(DataMapping dataMapping);
    
    DataMapping findDataMappingById(UUID id);
    
    List<DataMapping> findAllDataMappings();
    
    void updateDataMapping(DataMapping dataMapping);
    
    void deleteDataMapping(UUID id);
}
