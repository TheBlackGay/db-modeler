package com.db.modeler.service;

import com.db.modeler.entity.User;
import java.util.Optional;
import java.util.UUID;

public interface AuthService {
    User register(String username, String email, String password);
    Optional<User> login(String email, String password);
    User getProfile(UUID userId);
    void sendResetCode(String email);
    void resetPassword(String email, String resetCode, String newPassword);
}
