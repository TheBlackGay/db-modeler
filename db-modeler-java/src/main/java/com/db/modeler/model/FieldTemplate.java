package com.db.modeler.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;
import lombok.Data;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Data
@Entity
@Table(name = "field_templates")
public class FieldTemplate {
    @Id
    private String id;
    
    @Column(nullable = false)
    private String name;
    
    @Column(name = "field_name", nullable = false)
    private String fieldName;
    
    @Column(name = "data_type", nullable = false)
    private String dataType;
    
    private Integer length;
    private Integer precision;
    private Boolean nullable;
    
    @Column(name = "primary_key")
    private Boolean primaryKey;
    
    @Column(name = "auto_increment")
    private Boolean autoIncrement;
    
    @Column(name = "default_value")
    private String defaultValue;
    
    private String comment;
    
    @Enumerated(EnumType.STRING)
    private Category category;
    
    @ElementCollection
    @CollectionTable(name = "field_template_tags", joinColumns = @JoinColumn(name = "template_id"))
    @Column(name = "tag")
    private List<String> tags;
    
    @Column(name = "create_time")
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
