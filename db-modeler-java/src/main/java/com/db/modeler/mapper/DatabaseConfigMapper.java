package com.db.modeler.mapper;

import com.db.modeler.entity.DatabaseConfig;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.UUID;

@Mapper
public interface DatabaseConfigMapper {
    
    @Insert("""
        INSERT INTO database_configs (
            id, project_id, name, description, host, port,
            database_name, username, password, type, status,
            created_at, updated_at
        ) VALUES (
            #{id}, #{projectId}, #{name}, #{description}, #{host}, #{port},
            #{databaseName}, #{username}, #{password}, #{type}, #{status},
            #{createdAt}, #{updatedAt}
        )
    """)
    void insert(DatabaseConfig config);

    @Select("SELECT * FROM database_configs WHERE id = #{id} AND status != 'DELETED'")
    DatabaseConfig selectById(UUID id);

    @Select("SELECT * FROM database_configs WHERE project_id = #{projectId} AND status != 'DELETED'")
    List<DatabaseConfig> selectByProjectId(UUID projectId);

    @Update("""
        UPDATE database_configs SET
            name = #{name},
            description = #{description},
            host = #{host},
            port = #{port},
            database_name = #{databaseName},
            username = #{username},
            password = #{password},
            type = #{type},
            status = #{status},
            updated_at = #{updatedAt}
        WHERE id = #{id}
    """)
    void update(DatabaseConfig config);

    @Update("UPDATE database_configs SET status = 'DELETED', updated_at = NOW() WHERE id = #{id}")
    void deleteById(UUID id);

    @Update("UPDATE database_configs SET status = 'DELETED', updated_at = NOW() WHERE project_id = #{projectId}")
    void deleteByProjectId(UUID projectId);
}
