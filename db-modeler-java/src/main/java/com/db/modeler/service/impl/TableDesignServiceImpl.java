package com.db.modeler.service.impl;

import com.db.modeler.entity.TableDesign;
import com.db.modeler.repository.TableDesignRepository;
import com.db.modeler.service.TableDesignService;
import com.db.modeler.exception.ResourceNotFoundException;
import com.db.modeler.exception.ValidationException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.UUID;

@Service
public class TableDesignServiceImpl implements TableDesignService {
    
    @Autowired
    private TableDesignRepository tableDesignRepository;

    @Override
    @Transactional
    public TableDesign createTableDesign(TableDesign tableDesign) {
        validateTableDesign(tableDesign);
        
        tableDesign.setId(UUID.randomUUID());
        tableDesign.setStatus(TableDesign.Status.DRAFT);
        tableDesignRepository.save(tableDesign);
        
        return tableDesign;
    }

    @Override
    public TableDesign getTableDesignById(UUID tableDesignId) {
        TableDesign tableDesign = tableDesignRepository.findById(tableDesignId);
        if (tableDesign == null) {
            throw new ResourceNotFoundException("Table design not found with id: " + tableDesignId);
        }
        return tableDesign;
    }

    @Override
    public List<TableDesign> getAllTableDesigns() {
        return tableDesignRepository.findAll();
    }

    @Override
    @Transactional
    public TableDesign updateTableDesign(TableDesign tableDesign) {
        validateTableDesign(tableDesign);
        
        TableDesign existingTableDesign = getTableDesignById(tableDesign.getId());
        
        // Update fields
        existingTableDesign.setName(tableDesign.getName());
        existingTableDesign.setComment(tableDesign.getComment());
        existingTableDesign.setType(tableDesign.getType());
        existingTableDesign.setColumns(tableDesign.getColumns());
        existingTableDesign.setStatus(tableDesign.getStatus());
        existingTableDesign.setMetadata(tableDesign.getMetadata());
        
        tableDesignRepository.update(existingTableDesign);
        return existingTableDesign;
    }

    @Override
    @Transactional
    public void deleteTableDesign(UUID tableDesignId) {
        getTableDesignById(tableDesignId); // Check if exists
        tableDesignRepository.deleteById(tableDesignId);
    }
    
    private void validateTableDesign(TableDesign tableDesign) {
        if (tableDesign == null) {
            throw new ValidationException("Table design cannot be null");
        }
        if (!StringUtils.hasText(tableDesign.getName())) {
            throw new ValidationException("Table design name is required");
        }
        if (tableDesign.getType() == null) {
            throw new ValidationException("Table design type is required");
        }
        if (!StringUtils.hasText(tableDesign.getColumns())) {
            throw new ValidationException("Table design columns are required");
        }
    }
}
