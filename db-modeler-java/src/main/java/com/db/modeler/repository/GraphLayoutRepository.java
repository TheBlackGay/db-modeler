package com.db.modeler.repository;

import com.db.modeler.entity.GraphLayout;
import org.apache.ibatis.annotations.*;
import org.apache.ibatis.type.JdbcType;

import java.util.List;

@Mapper
public interface GraphLayoutRepository {
    int insert(GraphLayout graphLayout);
    
    int update(GraphLayout graphLayout);
    
    int deleteById(@Param("id") String id);
    
    GraphLayout selectById(@Param("id") String id);
    
    List<GraphLayout> selectByProjectId(@Param("projectId") String projectId);
    
    int deleteByProjectId(@Param("projectId") String projectId);
}
