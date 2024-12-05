package com.db.modeler.controller;

import com.db.modeler.entity.User;
import com.db.modeler.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestParam String username, @RequestParam String email, @RequestParam String password) {
        User user = authService.register(username, email, password);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/login")
    public ResponseEntity<User> login(@RequestParam String email, @RequestParam String password) {
        Optional<User> user = authService.login(email, password);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.status(401).build());
    }

    @GetMapping("/profile/{id}")
    public ResponseEntity<User> getProfile(@PathVariable UUID id) {
        User user = authService.getProfile(id);
        return ResponseEntity.ok(user);
    }

    @PostMapping("/send-reset-code")
    public ResponseEntity<Void> sendResetCode(@RequestParam String email) {
        authService.sendResetCode(email);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Void> resetPassword(@RequestParam String email, @RequestParam String resetCode, @RequestParam String newPassword) {
        authService.resetPassword(email, resetCode, newPassword);
        return ResponseEntity.ok().build();
    }
}
