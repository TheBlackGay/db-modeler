package com.db.modeler.controller;

import com.db.modeler.service.ReverseEngineeringService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/reverse-engineering")
public class ReverseEngineeringController {

    @Autowired
    private ReverseEngineeringService reverseEngineeringService;

    @GetMapping("/extract-schema/{connectionId}")
    public ResponseEntity<List<String>> extractDatabaseSchema(@PathVariable String connectionId, @RequestParam String projectId) {
        List<String> schema = reverseEngineeringService.extractDatabaseSchema(connectionId, projectId);
        return ResponseEntity.ok(schema);
    }
}
