package com.db.modeler.mapper.typehandler;

import com.db.modeler.entity.User;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class RoleTypeHandler extends BaseTypeHandler<User.Role> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, User.Role parameter, JdbcType jdbcType) throws SQLException {
        ps.setString(i, parameter.name().toLowerCase());
    }

    @Override
    public User.Role getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String value = rs.getString(columnName);
        return value == null ? null : User.Role.valueOf(value.toUpperCase());
    }

    @Override
    public User.Role getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        String value = rs.getString(columnIndex);
        return value == null ? null : User.Role.valueOf(value.toUpperCase());
    }

    @Override
    public User.Role getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        String value = cs.getString(columnIndex);
        return value == null ? null : User.Role.valueOf(value.toUpperCase());
    }
}
