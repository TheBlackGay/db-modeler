package com.db.modeler.service;

import com.db.modeler.entity.GraphLayout;
import com.db.modeler.repository.GraphLayoutRepository;
import com.db.modeler.exception.ResourceNotFoundException;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class GraphLayoutServiceTest {

    @Mock
    private GraphLayoutRepository graphLayoutRepository;

    @InjectMocks
    private GraphLayoutService graphLayoutService;

    private GraphLayout testLayout;
    private String projectId;
    private String layoutId;

    @BeforeEach
    void setUp() {
        projectId = "test-project";
        layoutId = "test-layout";

        testLayout = new GraphLayout();
        testLayout.setId(layoutId);
        testLayout.setProjectId(projectId);
        testLayout.setLayoutData("test-data");
        testLayout.setCreatedAt(System.currentTimeMillis());
        testLayout.setUpdatedAt(System.currentTimeMillis());
    }

    @Test
    void getProjectLayout_Success() {
        List<GraphLayout> layouts = Collections.singletonList(testLayout);
        when(graphLayoutRepository.selectByProjectId(projectId)).thenReturn(layouts);

        List<GraphLayout> result = graphLayoutService.getProjectLayout(projectId);

        assertNotNull(result);
        assertFalse(result.isEmpty());
        assertEquals(testLayout.getId(), result.get(0).getId());
        verify(graphLayoutRepository).selectByProjectId(projectId);
    }

    @Test
    void getProjectLayout_NotFound() {
        when(graphLayoutRepository.selectByProjectId(projectId)).thenReturn(Collections.emptyList());

        assertThrows(ResourceNotFoundException.class, () -> {
            graphLayoutService.getProjectLayout(projectId);
        });
    }

    @Test
    void saveProjectLayout_Success() {
        when(graphLayoutRepository.insert(any(GraphLayout.class))).thenReturn(1);

        GraphLayout result = graphLayoutService.saveProjectLayout(projectId, "new-data");

        assertNotNull(result);
        assertEquals(projectId, result.getProjectId());
        assertEquals("new-data", result.getLayoutData());
        verify(graphLayoutRepository).insert(any(GraphLayout.class));
    }

    @Test
    void updateProjectLayout_Success() {
        when(graphLayoutRepository.selectById(layoutId)).thenReturn(testLayout);
        when(graphLayoutRepository.update(any(GraphLayout.class))).thenReturn(1);

        GraphLayout result = graphLayoutService.updateProjectLayout(layoutId, "updated-data");

        assertNotNull(result);
        assertEquals(layoutId, result.getId());
        assertEquals("updated-data", result.getLayoutData());
        verify(graphLayoutRepository).update(any(GraphLayout.class));
    }

    @Test
    void updateProjectLayout_NotFound() {
        when(graphLayoutRepository.selectById(layoutId)).thenReturn(null);

        assertThrows(ResourceNotFoundException.class, () -> {
            graphLayoutService.updateProjectLayout(layoutId, "updated-data");
        });
    }
}
