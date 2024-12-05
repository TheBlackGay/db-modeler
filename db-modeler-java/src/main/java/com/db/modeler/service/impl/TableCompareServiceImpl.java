package com.db.modeler.service.impl;

import com.db.modeler.service.TableCompareService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;

@Service
public class TableCompareServiceImpl implements TableCompareService {
    @Override
    public List<String> compareTableSchemas(String sourceId, String targetId) {
        // Implementation logic
        return new ArrayList<>();
    }
}
