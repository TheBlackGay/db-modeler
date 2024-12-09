package com.db.modeler.service;

import com.db.modeler.dto.ProjectMemberDTO;
import java.util.List;
import java.util.UUID;

public interface ProjectMemberService {
    /**
     * 添加项目成员
     */
    ProjectMemberDTO addProjectMember(UUID projectId, UUID userId, String role);
    
    /**
     * 获取项目成员列表
     */
    List<ProjectMemberDTO> getProjectMembers(UUID projectId);
    
    /**
     * 更新项目成员角色
     */
    ProjectMemberDTO updateMemberRole(UUID projectId, UUID userId, String role);
    
    /**
     * 移除项目成员
     */
    void removeProjectMember(UUID projectId, UUID userId);
    
    /**
     * 检查用户是否是项目成员
     */
    boolean isMember(UUID projectId, UUID userId);
    
    /**
     * 检查用户是否是项目管理员或拥有者
     */
    boolean isManagerOrOwner(UUID projectId, UUID userId);
}
