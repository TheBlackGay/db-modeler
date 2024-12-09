package com.db.modeler.mapper.typehandler;

import com.db.modeler.entity.DatabaseConfig.Type;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedTypes;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@MappedTypes(Type.class)
public class DatabaseTypeHandler extends BaseTypeHandler<Type> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, Type parameter, JdbcType jdbcType) throws SQLException {
        ps.setString(i, parameter.name());
    }

    @Override
    public Type getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String value = rs.getString(columnName);
        return value == null ? null : Type.valueOf(value);
    }

    @Override
    public Type getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        String value = rs.getString(columnIndex);
        return value == null ? null : Type.valueOf(value);
    }

    @Override
    public Type getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        String value = cs.getString(columnIndex);
        return value == null ? null : Type.valueOf(value);
    }
}
