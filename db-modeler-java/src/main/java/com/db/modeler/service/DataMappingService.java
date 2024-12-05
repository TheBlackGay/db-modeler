package com.db.modeler.service;

import com.db.modeler.entity.DataMapping;
import java.util.List;
import java.util.UUID;

public interface DataMappingService {
    DataMapping createDataMapping(DataMapping dataMapping);
    DataMapping getDataMappingById(UUID dataMappingId);
    List<DataMapping> getAllDataMappings();
    DataMapping updateDataMapping(DataMapping dataMapping);
    void deleteDataMapping(UUID dataMappingId);
}
