package com.db.modeler.service;

import java.util.List;

public interface TableCompareService {
    List<String> compareTableSchemas(String sourceId, String targetId);
}
