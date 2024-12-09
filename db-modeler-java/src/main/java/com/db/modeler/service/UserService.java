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
    /**
     * 搜索用户
     * @param query 搜索关键词（用户名或邮箱）
     * @return 匹配的用户列表
     */
    List<User> searchUsers(String query);
}
