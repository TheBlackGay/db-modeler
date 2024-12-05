package com.db.modeler.service.impl;

import com.db.modeler.entity.Database;
import com.db.modeler.mapper.DatabaseMapper;
import com.db.modeler.service.DatabaseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class DatabaseServiceImpl implements DatabaseService {
    
    @Autowired
    private DatabaseMapper databaseMapper;

    @Override
    public Database createDatabase(Database database) {
        if (database.getId() == null) {
            database.setId(UUID.randomUUID());
        }
        databaseMapper.insertDatabase(database);
        return database;
    }

    @Override
    public Database getDatabaseById(UUID databaseId) {
        return databaseMapper.findDatabaseById(databaseId);
    }

    @Override
    public List<Database> getAllDatabases() {
        return databaseMapper.findAllDatabases();
    }

    @Override
    public Database updateDatabase(Database database) {
        databaseMapper.updateDatabase(database);
        return database;
    }

    @Override
    public void deleteDatabase(UUID databaseId) {
        databaseMapper.deleteDatabase(databaseId);
    }
}
