package com.db.modeler.service;

import java.util.List;

public interface ReverseEngineeringService {
    List<String> extractDatabaseSchema(String connectionId, String projectId);
}
