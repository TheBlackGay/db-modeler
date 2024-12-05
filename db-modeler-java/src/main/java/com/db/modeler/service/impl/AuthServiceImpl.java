package com.db.modeler.service.impl;

import com.db.modeler.entity.User;
import com.db.modeler.mapper.UserMapper;
import com.db.modeler.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserMapper userMapper;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public User register(String username, String email, String password) {
        // Check if email already exists
        User existingUser = userMapper.findByEmail(email);
        if (existingUser != null) {
            throw new RuntimeException("Email already registered");
        }

        // Create new user
        User user = new User();
        user.setId(UUID.randomUUID());
        user.setUsername(username);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(password));
        user.setRole(User.Role.VIEWER);
        user.setStatus(User.Status.ACTIVE);
        user.setCreatedAt(LocalDateTime.now());
        user.setUpdatedAt(LocalDateTime.now());

        userMapper.insertUser(user);
        return user;
    }

    @Override
    public Optional<User> login(String email, String password) {
        User user = userMapper.findByEmail(email);
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return Optional.of(user);
        }
        return Optional.empty();
    }

    @Override
    public User getProfile(UUID userId) {
        User user = userMapper.findUserById(userId);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        return user;
    }

    @Override
    public void sendResetCode(String email) {
        User user = userMapper.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        
        // Generate reset code
        String resetCode = UUID.randomUUID().toString().substring(0, 6);
        userMapper.updateResetCode(email, resetCode);
        
        // TODO: Send email with reset code
        System.out.println("Reset code for " + email + ": " + resetCode);
    }

    @Override
    public void resetPassword(String email, String resetCode, String newPassword) {
        User user = userMapper.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found");
        }
        
        if (user.getResetCode() == null || 
            !user.getResetCode().equals(resetCode) || 
            user.getResetCodeExpiry().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Invalid or expired reset code");
        }
        
        user.setPassword(passwordEncoder.encode(newPassword));
        user.setResetCode(null);
        user.setResetCodeExpiry(null);
        user.setUpdatedAt(LocalDateTime.now());
        userMapper.updateUser(user);
    }
}
