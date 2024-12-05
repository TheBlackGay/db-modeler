package com.db.modeler.controller;

import com.db.modeler.service.TableCompareService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/table-compare")
public class TableCompareController {

    @Autowired
    private TableCompareService tableCompareService;

    @GetMapping("/compare-schemas/{sourceId}/{targetId}")
    public ResponseEntity<List<String>> compareTableSchemas(@PathVariable String sourceId, @PathVariable String targetId) {
        List<String> differences = tableCompareService.compareTableSchemas(sourceId, targetId);
        return ResponseEntity.ok(differences);
    }
}
