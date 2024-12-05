package com.db.modeler.service.impl;

import com.db.modeler.entity.User;
import com.db.modeler.mapper.UserMapper;
import com.db.modeler.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class UserServiceImpl implements UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserServiceImpl.class);

    @Autowired
    private UserMapper userMapper;

    @Override
    public User createUser(User user) {
        try {
            logger.info("Creating new user with username: {}", user.getUsername());
            user.setId(UUID.randomUUID());
            user.setCreatedAt(LocalDateTime.now());
            user.setUpdatedAt(LocalDateTime.now());
            userMapper.insertUser(user);
            logger.info("Successfully created user with ID: {}", user.getId());
            return user;
        } catch (Exception e) {
            logger.error("Error creating user: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create user", e);
        }
    }

    @Override
    public User getUserById(UUID userId) {
        try {
            logger.info("Fetching user with ID: {}", userId);
            User user = userMapper.findUserById(userId);
            if (user != null) {
                logger.info("Found user: {}", user.getUsername());
            } else {
                logger.warn("No user found with ID: {}", userId);
            }
            return user;
        } catch (Exception e) {
            logger.error("Error fetching user with ID {}: {}", userId, e.getMessage(), e);
            throw new RuntimeException("Failed to fetch user", e);
        }
    }

    @Override
    public List<User> getAllUsers() {
        try {
            logger.info("Fetching all users");
            List<User> users = userMapper.findAllUsers();
            logger.info("Found {} users", users.size());
            return users;
        } catch (Exception e) {
            logger.error("Error fetching all users: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to fetch users", e);
        }
    }

    @Override
    public User updateUser(User user) {
        try {
            logger.info("Updating user with ID: {}", user.getId());
            User existingUser = userMapper.findUserById(user.getId());
            if (existingUser == null) {
                throw new RuntimeException("User not found");
            }
            user.setCreatedAt(existingUser.getCreatedAt());
            user.setUpdatedAt(LocalDateTime.now());
            userMapper.updateUser(user);
            logger.info("Successfully updated user with ID: {}", user.getId());
            return user;
        } catch (Exception e) {
            logger.error("Error updating user: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to update user", e);
        }
    }

    @Override
    public void deleteUser(UUID userId) {
        try {
            logger.info("Deleting user with ID: {}", userId);
            userMapper.deleteUser(userId);
            logger.info("Successfully deleted user with ID: {}", userId);
        } catch (Exception e) {
            logger.error("Error deleting user with ID {}: {}", userId, e.getMessage(), e);
            throw new RuntimeException("Failed to delete user", e);
        }
    }
}
