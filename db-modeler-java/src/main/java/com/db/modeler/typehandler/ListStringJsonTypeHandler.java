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

@MappedTypes(List.class)
public class ListStringJsonTypeHandler extends BaseTypeHandler<List<String>> {
    private static final ObjectMapper mapper = new ObjectMapper();

    @Override
    public void setNonNullParameter(PreparedStatement ps, int i, List<String> parameter, JdbcType jdbcType) throws SQLException {
        ps.setString(i, toJson(parameter));
    }

    @Override
    public List<String> getNullableResult(ResultSet rs, String columnName) throws SQLException {
        String json = rs.getString(columnName);
        return fromJson(json);
    }

    @Override
    public List<String> getNullableResult(ResultSet rs, int columnIndex) throws SQLException {
        String json = rs.getString(columnIndex);
        return fromJson(json);
    }

    @Override
    public List<String> getNullableResult(CallableStatement cs, int columnIndex) throws SQLException {
        String json = cs.getString(columnIndex);
        return fromJson(json);
    }

    private String toJson(List<String> list) {
        if (list == null) {
            return "[]";
        }
        try {
            return mapper.writeValueAsString(list);
        } catch (Exception e) {
            throw new RuntimeException("Error converting List<String> to JSON", e);
        }
    }

    private List<String> fromJson(String json) {
        if (json == null || json.isEmpty()) {
            return List.of();
        }
        try {
            return mapper.readValue(json, new TypeReference<List<String>>() {});
        } catch (Exception e) {
            throw new RuntimeException("Error converting JSON to List<String>", e);
        }
    }
} 