package com.db.modeler.mapper;

import com.db.modeler.entity.TableDesign;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.UUID;

@Mapper
public interface TableDesignMapper {

    @Insert("INSERT INTO table_designs (id, name, comment, type, columns, status, metadata, created_by) VALUES (#{id}, #{name}, #{comment}, #{type}, #{columns}, #{status}, #{metadata}, #{createdBy})")
    void insertTableDesign(TableDesign tableDesign);

    @Select("SELECT * FROM table_designs WHERE id = #{id}")
    TableDesign findTableDesignById(UUID id);

    @Select("SELECT * FROM table_designs")
    List<TableDesign> findAllTableDesigns();

    @Update("UPDATE table_designs SET name = #{name}, comment = #{comment}, type = #{type}, columns = #{columns}, status = #{status}, metadata = #{metadata}, created_by = #{createdBy} WHERE id = #{id}")
    void updateTableDesign(TableDesign tableDesign);

    @Delete("DELETE FROM table_designs WHERE id = #{id}")
    void deleteTableDesign(UUID id);
}
