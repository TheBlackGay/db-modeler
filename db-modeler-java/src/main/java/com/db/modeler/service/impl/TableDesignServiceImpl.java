package com.db.modeler.service.impl;

import com.db.modeler.entity.TableDesign;
import com.db.modeler.service.TableDesignService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class TableDesignServiceImpl implements TableDesignService {
    @Override
    public TableDesign createTableDesign(TableDesign tableDesign) {
        // Implementation logic
        return null;
    }

    @Override
    public TableDesign getTableDesignById(UUID tableDesignId) {
        // Implementation logic
        return null;
    }

    @Override
    public List<TableDesign> getAllTableDesigns() {
        // Implementation logic
        return null;
    }

    @Override
    public TableDesign updateTableDesign(TableDesign tableDesign) {
        // Implementation logic
        return null;
    }

    @Override
    public void deleteTableDesign(UUID tableDesignId) {
        // Implementation logic
    }
}
