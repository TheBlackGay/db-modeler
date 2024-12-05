package com.db.modeler.mapper;

import com.db.modeler.entity.Database;
import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.UUID;

@Mapper
public interface DatabaseMapper {
    void insertDatabase(Database database);
    
    Database findDatabaseById(UUID id);
    
    List<Database> findAllDatabases();
    
    void updateDatabase(Database database);
    
    void deleteDatabase(UUID id);
}
