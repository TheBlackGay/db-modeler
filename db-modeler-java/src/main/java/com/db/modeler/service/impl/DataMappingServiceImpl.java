package com.db.modeler.service.impl;

import com.db.modeler.entity.DataMapping;
import com.db.modeler.service.DataMappingService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DataMappingServiceImpl implements DataMappingService {
    @Override
    public DataMapping createDataMapping(DataMapping dataMapping) {
        // Implementation logic
        return null;
    }

    @Override
    public DataMapping getDataMappingById(UUID dataMappingId) {
        // Implementation logic
        return null;
    }

    @Override
    public List<DataMapping> getAllDataMappings() {
        // Implementation logic
        return null;
    }

    @Override
    public DataMapping updateDataMapping(DataMapping dataMapping) {
        // Implementation logic
        return null;
    }

    @Override
    public void deleteDataMapping(UUID dataMappingId) {
        // Implementation logic
    }
}
