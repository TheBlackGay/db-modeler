package com.db.modeler.service;

import com.db.modeler.entity.Database;
import java.util.List;
import java.util.UUID;

public interface DatabaseService {
    Database createDatabase(Database database);
    Database getDatabaseById(UUID databaseId);
    List<Database> getAllDatabases();
    Database updateDatabase(Database database);
    void deleteDatabase(UUID databaseId);
}
