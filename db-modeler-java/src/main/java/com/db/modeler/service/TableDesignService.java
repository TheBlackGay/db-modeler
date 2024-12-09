package com.db.modeler.service;

import com.db.modeler.entity.TableDesign;
import java.util.List;
import java.util.Map;
import java.util.UUID;

public interface TableDesignService {
    TableDesign createTableDesign(TableDesign tableDesign);
    TableDesign getTableDesignById(UUID tableDesignId);
    List<TableDesign> getAllTableDesigns();
    List<TableDesign> getTableDesignsByProjectId(UUID projectId);
    TableDesign updateTableDesign(TableDesign tableDesign);
    void deleteTableDesign(UUID tableDesignId);
    
    // 同步相关的方法
    TableDesign syncToDatabase(UUID tableDesignId);
    List<TableDesign> syncAllTables();
    
    // DDL预览相关的方法
    Map<String, String> previewDDL(UUID tableDesignId);
    List<Map<String, String>> previewAllDDL();
}
