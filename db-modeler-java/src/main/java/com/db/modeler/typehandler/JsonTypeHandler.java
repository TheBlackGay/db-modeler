package com.db.modeler.typehandler;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.ibatis.type.BaseTypeHandler;
import org.apache.ibatis.type.JdbcType;
import org.apache.ibatis.type.MappedTypes;

import java.sql.CallableStatement;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.List;

@MappedTypes(Object.class)
public class JsonTypeHandler extends BaseTypeHandler<Object> {
    private static final ObjectMapper mapper = new ObjectMapper();
    private final Class<?> type;

    public JsonTypeHandler(Class<?> type) {
        if (type == null) throw new IllegalArgumentException("Type argument cannot be null");
        this.type = type;
    }

    public JsonTypeHandler() {
        this.type = Object.class;
    }

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, Object parameter, JdbcType jdbcType) throws SQLException {
        ps.setString(i, toJson(parameter));
    }

    @Override
    public Object getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String json = rs.getString(columnName);
        return fromJson(json);
    }

    @Override
    public Object getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        String json = rs.getString(columnIndex);
        return fromJson(json);
    }

    @Override
    public Object getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        String json = cs.getString(columnIndex);
        return fromJson(json);
    }

    private String toJson(Object object) {
        if (object == null) {
            return null;
        }
        try {
            return mapper.writeValueAsString(object);
        } catch (Exception e) {
            throw new RuntimeException("Error converting object to JSON", e);
        }
    }

    private Object fromJson(String json) {
        if (json == null || json.isEmpty()) {
            return null;
        }
        try {
            if (List.class.isAssignableFrom(type)) {
                return mapper.readValue(json, new TypeReference<List<String>>() {});
            }
            return mapper.readValue(json, type);
        } catch (Exception e) {
            throw new RuntimeException("Error converting JSON to object", e);
        }
    }
} 