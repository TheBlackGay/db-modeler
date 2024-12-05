package com.db.modeler.mapper.typehandler;

import com.db.modeler.entity.User;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class UserStatusTypeHandler extends BaseTypeHandler<User.Status> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, User.Status parameter, JdbcType jdbcType) throws SQLException {
        ps.setString(i, parameter.name().toLowerCase());
    }

    @Override
    public User.Status getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String value = rs.getString(columnName);
        return value == null ? null : User.Status.valueOf(value.toUpperCase());
    }

    @Override
    public User.Status getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        String value = rs.getString(columnIndex);
        return value == null ? null : User.Status.valueOf(value.toUpperCase());
    }

    @Override
    public User.Status getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        String value = cs.getString(columnIndex);
        return value == null ? null : User.Status.valueOf(value.toUpperCase());
    }
}
