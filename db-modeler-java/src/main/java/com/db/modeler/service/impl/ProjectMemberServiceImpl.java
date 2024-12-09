package com.db.modeler.service.impl;

import com.db.modeler.dto.ProjectMemberDTO;
import com.db.modeler.entity.ProjectMember;
import com.db.modeler.entity.User;
import com.db.modeler.mapper.ProjectMemberMapper;
import com.db.modeler.mapper.UserMapper;
import com.db.modeler.service.ProjectMemberService;
import com.db.modeler.exception.ResourceNotFoundException;
import com.db.modeler.exception.IllegalOperationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Date;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class ProjectMemberServiceImpl implements ProjectMemberService {

    @Autowired
    private ProjectMemberMapper projectMemberMapper;

    @Autowired
    private UserMapper userMapper;

    @Override
    @Transactional
    public ProjectMemberDTO addProjectMember(UUID projectId, UUID userId, String role) {
        // 检查用户是否存在
        User user = userMapper.findById(userId);
        if (user == null) {
            throw new ResourceNotFoundException("User not found");
        }

        // 检查是否已经是成员
        ProjectMember existingMember = projectMemberMapper.findByProjectIdAndUserId(projectId, userId);
        if (existingMember != null) {
            throw new IllegalOperationException("User is already a member of this project");
        }

        // 创建新成员
        ProjectMember member = new ProjectMember();
        member.setId(UUID.randomUUID());
        member.setProjectId(projectId);
        member.setUserId(userId);
        member.setRole(role);
        member.setCreatedAt(new Date());
        member.setUpdatedAt(new Date());

        projectMemberMapper.insertProjectMember(member);

        return convertToDTO(member, user);
    }

    @Override
    public List<ProjectMemberDTO> getProjectMembers(UUID projectId) {
        List<ProjectMember> members = projectMemberMapper.findByProjectId(projectId);
        return members.stream()
                .map(member -> {
                    User user = userMapper.findById(member.getUserId());
                    return convertToDTO(member, user);
                })
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ProjectMemberDTO updateMemberRole(UUID projectId, UUID userId, String role) {
        ProjectMember member = projectMemberMapper.findByProjectIdAndUserId(projectId, userId);
        if (member == null) {
            throw new ResourceNotFoundException("Member not found");
        }

        // 不允许修改项目拥有者的角色
        if ("OWNER".equals(member.getRole())) {
            throw new IllegalOperationException("Cannot change owner's role");
        }

        member.setRole(role);
        member.setUpdatedAt(new Date());
        projectMemberMapper.updateProjectMember(member);

        User user = userMapper.findById(userId);
        return convertToDTO(member, user);
    }

    @Override
    @Transactional
    public void removeProjectMember(UUID projectId, UUID userId) {
        ProjectMember member = projectMemberMapper.findByProjectIdAndUserId(projectId, userId);
        if (member == null) {
            throw new ResourceNotFoundException("Member not found");
        }

        // 不允许移除项目拥有者
        if ("OWNER".equals(member.getRole())) {
            throw new IllegalOperationException("Cannot remove project owner");
        }

        projectMemberMapper.deleteProjectMember(projectId, userId);
    }

    @Override
    public boolean isMember(UUID projectId, UUID userId) {
        ProjectMember member = projectMemberMapper.findByProjectIdAndUserId(projectId, userId);
        return member != null;
    }

    @Override
    public boolean isManagerOrOwner(UUID projectId, UUID userId) {
        ProjectMember member = projectMemberMapper.findByProjectIdAndUserId(projectId, userId);
        if (member == null) {
            return false;
        }
        return "OWNER".equals(member.getRole()) || "ADMIN".equals(member.getRole());
    }

    private ProjectMemberDTO convertToDTO(ProjectMember member, User user) {
        ProjectMemberDTO dto = new ProjectMemberDTO();
        dto.setId(member.getId());
        dto.setProjectId(member.getProjectId());
        dto.setUserId(member.getUserId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setRole(member.getRole());
        return dto;
    }
}
