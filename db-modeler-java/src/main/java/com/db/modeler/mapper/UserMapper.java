package com.db.modeler.mapper;

import com.db.modeler.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

import java.util.List;
import java.util.UUID;

@Mapper
public interface UserMapper {

    void insertUser(User user);

    User findUserById(UUID id);

    List<User> findAllUsers();

    void updateUser(User user);

    void deleteUser(UUID id);
    
    User findByEmail(@Param("email") String email);
    
    void updateResetCode(@Param("email") String email, @Param("resetCode") String resetCode);

    @Select("SELECT * FROM users WHERE id = #{id}")
    User findById(@Param("id") UUID id);

    @Select("SELECT * FROM users WHERE username LIKE #{query} OR email LIKE #{query} LIMIT 10")
    List<User> searchUsers(String query);
}
