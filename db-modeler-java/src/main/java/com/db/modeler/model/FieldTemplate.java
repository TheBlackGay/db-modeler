package com.db.modeler.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class FieldTemplate {
    private String id;
    private String name;
    private String fieldName;
    private String dataType;
    private Integer length;
    private Integer precision;
    private Boolean nullable;
    private Boolean primaryKey;
    private Boolean autoIncrement;
    private String defaultValue;
    private String comment;
    private Category category;
    private List<String> tags;
    private LocalDateTime createTime;

    public enum Category {
        BASIC("BASIC"),
        BUSINESS("BUSINESS"),
        SYSTEM("SYSTEM");

        private final String value;

        Category(String value) {
            this.value = value;
        }

        @JsonValue
        public String getValue() {
            return value;
        }

        @JsonCreator
        public static Category fromValue(String value) {
            if (value == null) {
                return null;
            }
            for (Category category : Category.values()) {
                if (category.value.equalsIgnoreCase(value)) {
                    return category;
                }
            }
            throw new IllegalArgumentException("Invalid category: " + value);
        }
    }
}
