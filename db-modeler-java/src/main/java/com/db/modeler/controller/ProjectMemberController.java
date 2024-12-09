package com.db.modeler.controller;

import com.db.modeler.dto.ProjectMemberDTO;
import com.db.modeler.service.ProjectMemberService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/projects/{projectId}/members")
@CrossOrigin(origins = "*")
public class ProjectMemberController {

    @Autowired
    private ProjectMemberService projectMemberService;

    @GetMapping
    public ResponseEntity<List<ProjectMemberDTO>> getProjectMembers(@PathVariable UUID projectId) {
        List<ProjectMemberDTO> members = projectMemberService.getProjectMembers(projectId);
        return ResponseEntity.ok(members);
    }

    @PostMapping
    public ResponseEntity<ProjectMemberDTO> addProjectMember(
            @PathVariable UUID projectId,
            @RequestBody Map<String, String> request) {
        UUID userId = UUID.fromString(request.get("userId"));
        String role = request.get("role");
        ProjectMemberDTO member = projectMemberService.addProjectMember(projectId, userId, role);
        return ResponseEntity.ok(member);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<ProjectMemberDTO> updateMemberRole(
            @PathVariable UUID projectId,
            @PathVariable UUID userId,
            @RequestBody Map<String, String> request) {
        String role = request.get("role");
        ProjectMemberDTO member = projectMemberService.updateMemberRole(projectId, userId, role);
        return ResponseEntity.ok(member);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<Void> removeProjectMember(
            @PathVariable UUID projectId,
            @PathVariable UUID userId) {
        projectMemberService.removeProjectMember(projectId, userId);
        return ResponseEntity.ok().build();
    }
}
