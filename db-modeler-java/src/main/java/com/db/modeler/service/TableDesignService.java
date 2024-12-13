package com.db.modeler.service;

import com.db.modeler.entity.TableDesign;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
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
    
    /**
     * 批量导出表的 DDL
     * @param tableIds 表ID列表
     * @return DDL 内容的字节数组
     */
    byte[] batchExportTableSql(List<UUID> tableIds);

    /**
     * 导入表设计
     * @param file 导入的文件
     * @param projectId 项目ID
     * @return 导入的表设计
     * @throws IOException 如果文件读取失败
     */
    TableDesign importTableDesign(MultipartFile file, UUID projectId) throws IOException;
}
