package com.db.modeler.service;

import com.db.modeler.entity.User;
import java.util.List;
import java.util.UUID;

public interface UserService {
    User createUser(User user);
    User getUserById(UUID userId);
    List<User> getAllUsers();
    User updateUser(User user);
    void deleteUser(UUID userId);
}
