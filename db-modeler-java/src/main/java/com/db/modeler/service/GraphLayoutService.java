package com.db.modeler.service;

import com.db.modeler.entity.GraphLayout;
import com.db.modeler.repository.GraphLayoutRepository;
import com.db.modeler.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
public class GraphLayoutService {
    private final GraphLayoutRepository graphLayoutRepository;

    @Transactional(readOnly = true)
    public List<GraphLayout> getProjectLayout(String projectId) {
        List<GraphLayout> layouts = graphLayoutRepository.selectByProjectId(projectId);
        if (layouts.isEmpty()) {
            throw new ResourceNotFoundException("Graph layout not found for project: " + projectId);
        }
        return layouts;
    }

    @Transactional
    public GraphLayout saveProjectLayout(String projectId, String layoutData) {
        GraphLayout layout = new GraphLayout();
        layout.setId(java.util.UUID.randomUUID().toString());
        layout.setProjectId(projectId);
        layout.setLayoutData(layoutData);
        layout.setCreatedAt(System.currentTimeMillis());
        layout.setUpdatedAt(System.currentTimeMillis());
        
        graphLayoutRepository.insert(layout);
        return layout;
    }

    @Transactional
    public void deleteProjectLayout(String projectId) {
        graphLayoutRepository.deleteByProjectId(projectId);
    }

    @Transactional
    public GraphLayout updateProjectLayout(String layoutId, String layoutData) {
        GraphLayout layout = graphLayoutRepository.selectById(layoutId);
        if (layout == null) {
            throw new ResourceNotFoundException("Graph layout not found: " + layoutId);
        }
        
        layout.setLayoutData(layoutData);
        layout.setUpdatedAt(System.currentTimeMillis());
        graphLayoutRepository.update(layout);
        return layout;
    }
}
