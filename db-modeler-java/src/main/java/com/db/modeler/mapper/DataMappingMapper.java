package com.db.modeler.mapper;

import com.db.modeler.entity.DataMapping;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.UUID;

@Mapper
public interface DataMappingMapper {

    @Insert("INSERT INTO data_mappings (id, name, description, type, source_type, target_type, status, configuration, mapping_rules, schedule, last_execution_time, next_execution_time, execution_count, success_count, failure_count, is_active) VALUES (#{id}, #{name}, #{description}, #{type}, #{sourceType}, #{targetType}, #{status}, #{configuration}, #{mappingRules}, #{schedule}, #{lastExecutionTime}, #{nextExecutionTime}, #{executionCount}, #{successCount}, #{failureCount}, #{isActive})")
    void insertDataMapping(DataMapping dataMapping);

    @Select("SELECT * FROM data_mappings WHERE id = #{id}")
    DataMapping findDataMappingById(UUID id);

    @Select("SELECT * FROM data_mappings")
    List<DataMapping> findAllDataMappings();

    @Update("UPDATE data_mappings SET name = #{name}, description = #{description}, type = #{type}, source_type = #{sourceType}, target_type = #{targetType}, status = #{status}, configuration = #{configuration}, mapping_rules = #{mappingRules}, schedule = #{schedule}, last_execution_time = #{lastExecutionTime}, next_execution_time = #{nextExecutionTime}, execution_count = #{executionCount}, success_count = #{successCount}, failure_count = #{failureCount}, is_active = #{isActive} WHERE id = #{id}")
    void updateDataMapping(DataMapping dataMapping);

    @Delete("DELETE FROM data_mappings WHERE id = #{id}")
    void deleteDataMapping(UUID id);
}
