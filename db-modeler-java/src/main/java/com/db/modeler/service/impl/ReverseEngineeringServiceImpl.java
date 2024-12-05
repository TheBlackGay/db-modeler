package com.db.modeler.service.impl;

import com.db.modeler.service.ReverseEngineeringService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.ArrayList;

@Service
public class ReverseEngineeringServiceImpl implements ReverseEngineeringService {
    @Override
    public List<String> extractDatabaseSchema(String connectionId, String projectId) {
        // Implementation logic
        return new ArrayList<>();
    }
}
