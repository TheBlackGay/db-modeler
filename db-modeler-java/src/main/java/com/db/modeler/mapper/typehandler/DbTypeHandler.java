package com.db.modeler.mapper.typehandler;

import com.db.modeler.entity.Database.DbType;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedTypes;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

@MappedTypes(DbType.class)
public class DbTypeHandler extends BaseTypeHandler<DbType> {

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, DbType parameter, JdbcType jdbcType) throws SQLException {
        ps.setString(i, parameter.name());
    }

    @Override
    public DbType getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String value = rs.getString(columnName);
        return value == null ? null : DbType.valueOf(value);
    }

    @Override
    public DbType getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        String value = rs.getString(columnIndex);
        return value == null ? null : DbType.valueOf(value);
    }

    @Override
    public DbType getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        String value = cs.getString(columnIndex);
        return value == null ? null : DbType.valueOf(value);
    }
}
