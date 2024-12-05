package com.db.modeler.service;

import com.db.modeler.entity.TableDesign;
import java.util.List;
import java.util.UUID;

public interface TableDesignService {
    TableDesign createTableDesign(TableDesign tableDesign);
    TableDesign getTableDesignById(UUID tableDesignId);
    List<TableDesign> getAllTableDesigns();
    TableDesign updateTableDesign(TableDesign tableDesign);
    void deleteTableDesign(UUID tableDesignId);
}
