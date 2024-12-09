package com.db.modeler.controller;

import com.db.modeler.entity.GraphLayout;
import com.db.modeler.service.GraphLayoutService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/graph-layouts")
@RequiredArgsConstructor
public class GraphLayoutController {
    private final GraphLayoutService graphLayoutService;

    @GetMapping(value = "/projects/{projectId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<List<GraphLayout>> getProjectLayout(@PathVariable String projectId) {
        return ResponseEntity.ok(graphLayoutService.getProjectLayout(projectId));
    }

    @PostMapping(value = "/projects/{projectId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<GraphLayout> saveProjectLayout(
            @PathVariable String projectId,
            @RequestBody String layoutData) {
        return ResponseEntity.ok(graphLayoutService.saveProjectLayout(projectId, layoutData));
    }

    @PutMapping(value = "/{layoutId}", produces = MediaType.APPLICATION_JSON_VALUE)
    @ResponseBody
    public ResponseEntity<GraphLayout> updateProjectLayout(
            @PathVariable String layoutId,
            @RequestBody String layoutData) {
        return ResponseEntity.ok(graphLayoutService.updateProjectLayout(layoutId, layoutData));
    }

    @DeleteMapping("/projects/{projectId}")
    public ResponseEntity<Void> deleteProjectLayout(@PathVariable String projectId) {
        graphLayoutService.deleteProjectLayout(projectId);
        return ResponseEntity.ok().build();
    }
}
