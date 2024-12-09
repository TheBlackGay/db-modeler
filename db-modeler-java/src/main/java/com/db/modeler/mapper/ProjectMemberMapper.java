package com.db.modeler.mapper;

import com.db.modeler.entity.ProjectMember;
import org.apache.ibatis.annotations.*;

import java.util.List;
import java.util.UUID;

@Mapper
public interface ProjectMemberMapper {
    @Insert("INSERT INTO project_members (id, project_id, user_id, role, created_at, updated_at) " +
            "VALUES (#{id}, #{projectId}, #{userId}, #{role}, #{createdAt}, #{updatedAt})")
    void insertProjectMember(ProjectMember member);

    @Select("SELECT * FROM project_members WHERE project_id = #{projectId}")
    List<ProjectMember> findByProjectId(UUID projectId);

    @Select("SELECT * FROM project_members WHERE project_id = #{projectId} AND user_id = #{userId}")
    ProjectMember findByProjectIdAndUserId(@Param("projectId") UUID projectId, @Param("userId") UUID userId);

    @Update("UPDATE project_members SET role = #{role}, updated_at = #{updatedAt} " +
            "WHERE project_id = #{projectId} AND user_id = #{userId}")
    void updateProjectMember(ProjectMember member);

    @Delete("DELETE FROM project_members WHERE project_id = #{projectId} AND user_id = #{userId}")
    void deleteProjectMember(@Param("projectId") UUID projectId, @Param("userId") UUID userId);

    @Select("SELECT COUNT(*) FROM project_members WHERE project_id = #{projectId}")
    int countByProjectId(UUID projectId);
}
