package com.db.modeler.mapper;

import com.db.modeler.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

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
}
