package com.db.modeler.service;

import com.db.modeler.entity.TableRelation;
import com.db.modeler.repository.TableRelationMapper;
import com.db.modeler.service.impl.TableRelationServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.junit.jupiter.api.Assertions.*;

@ExtendWith(MockitoExtension.class)
class TableRelationServiceTest {

    @Mock
    private TableRelationMapper tableRelationMapper;

    @Mock
    private TableDesignService tableDesignService;

    @InjectMocks
    private TableRelationServiceImpl tableRelationService;

    private TableRelation testRelation;
    private UUID projectId;
    private UUID sourceTableId;
    private UUID targetTableId;

    @BeforeEach
    void setUp() {
        projectId = UUID.randomUUID();
        sourceTableId = UUID.randomUUID();
        targetTableId = UUID.randomUUID();

        testRelation = new TableRelation();
        testRelation.setId(UUID.randomUUID());
        testRelation.setProjectId(projectId);
        testRelation.setSourceTableId(sourceTableId);
        testRelation.setTargetTableId(targetTableId);
        testRelation.setRelationType(TableRelation.RelationType.ONE_TO_MANY);

        List<TableRelation.ColumnMapping> columnMappings = new ArrayList<>();
        columnMappings.add(new TableRelation.ColumnMapping(
            UUID.randomUUID(), UUID.randomUUID(), "PRIMARY_KEY"
        ));
        testRelation.setColumnMappings(columnMappings);
    }

    @Test
    void createTableRelation_Success() {
        when(tableDesignService.getTableDesignById(sourceTableId)).thenReturn(any());
        when(tableDesignService.getTableDesignById(targetTableId)).thenReturn(any());
        when(tableRelationMapper.insert(any(TableRelation.class))).thenReturn(1);
        when(tableRelationMapper.insertColumnMapping(any(), any())).thenReturn(1);

        TableRelation created = tableRelationService.createTableRelation(testRelation);

        assertNotNull(created);
        assertEquals(testRelation.getId(), created.getId());
        assertEquals(testRelation.getSourceTableId(), created.getSourceTableId());
        verify(tableRelationMapper).insert(any(TableRelation.class));
        verify(tableRelationMapper).insertColumnMapping(any(), any());
    }

    @Test
    void createTableRelation_InvalidRelation() {
        testRelation.setColumnMappings(null);

        assertThrows(IllegalArgumentException.class, () -> {
            tableRelationService.createTableRelation(testRelation);
        });
    }

    @Test
    void updateTableRelation_Success() {
        when(tableRelationMapper.selectById(any())).thenReturn(testRelation);
        when(tableDesignService.getTableDesignById(sourceTableId)).thenReturn(any());
        when(tableDesignService.getTableDesignById(targetTableId)).thenReturn(any());
        when(tableRelationMapper.update(any(TableRelation.class))).thenReturn(1);
        when(tableRelationMapper.deleteColumnMappings(any())).thenReturn(1);
        when(tableRelationMapper.insertColumnMapping(any(), any())).thenReturn(1);

        TableRelation updated = tableRelationService.updateTableRelation(testRelation);

        assertNotNull(updated);
        assertEquals(testRelation.getId(), updated.getId());
        verify(tableRelationMapper).update(any(TableRelation.class));
        verify(tableRelationMapper).deleteColumnMappings(any());
        verify(tableRelationMapper).insertColumnMapping(any(), any());
    }

    @Test
    void updateTableRelation_NotFound() {
        when(tableRelationMapper.selectById(any())).thenReturn(null);

        assertThrows(NoSuchElementException.class, () -> {
            tableRelationService.updateTableRelation(testRelation);
        });
    }

    @Test
    void getTableRelationsByProjectId_Success() {
        List<TableRelation> relations = Arrays.asList(testRelation);
        when(tableRelationMapper.selectByProjectId(projectId)).thenReturn(relations);

        List<TableRelation> found = tableRelationService.getTableRelationsByProjectId(projectId);

        assertNotNull(found);
        assertEquals(1, found.size());
        assertEquals(testRelation.getId(), found.get(0).getId());
    }

    @Test
    void checkCircularDependency_NoCycle() {
        when(tableRelationMapper.selectBySourceTableId(any())).thenReturn(Collections.emptyList());

        boolean hasCycle = tableRelationService.checkCircularDependency(projectId, testRelation);

        assertFalse(hasCycle);
    }

    @Test
    void checkCircularDependency_WithCycle() {
        TableRelation cycleRelation = new TableRelation();
        cycleRelation.setSourceTableId(targetTableId);
        cycleRelation.setTargetTableId(sourceTableId);

        when(tableRelationMapper.selectBySourceTableId(targetTableId))
            .thenReturn(Collections.singletonList(cycleRelation));

        boolean hasCycle = tableRelationService.checkCircularDependency(projectId, testRelation);

        assertTrue(hasCycle);
    }

    @Test
    void validateTableRelation_Success() {
        when(tableDesignService.getTableDesignById(any())).thenReturn(any());

        boolean isValid = tableRelationService.validateTableRelation(testRelation);

        assertTrue(isValid);
    }

    @Test
    void validateTableRelation_InvalidTables() {
        when(tableDesignService.getTableDesignById(any()))
            .thenThrow(new NoSuchElementException());

        boolean isValid = tableRelationService.validateTableRelation(testRelation);

        assertFalse(isValid);
    }

    @Test
    void getRelationsBetweenTables_Success() {
        List<TableRelation> relations = Arrays.asList(testRelation);
        when(tableRelationMapper.selectRelationsBetweenTables(sourceTableId, targetTableId))
            .thenReturn(relations);

        List<TableRelation> found = tableRelationService.getRelationsBetweenTables(
            sourceTableId, targetTableId);

        assertNotNull(found);
        assertEquals(1, found.size());
        assertEquals(testRelation.getId(), found.get(0).getId());
    }
}
