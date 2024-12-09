package com.db.modeler.entity;

import lombok.Data;
import io.swagger.v3.oas.annotations.media.Schema;

@Data
@Schema(description = "图形布局信息")
public class GraphLayout {
    @Schema(description = "布局ID")
    private String id;

    @Schema(description = "项目ID")
    private String projectId;

    @Schema(description = "布局数据")
    private String layoutData;

    @Schema(description = "创建时间")
    private Long createdAt;

    @Schema(description = "更新时间")
    private Long updatedAt;

    protected void onCreate() {
        createdAt = System.currentTimeMillis();
        updatedAt = System.currentTimeMillis();
    }

    protected void onUpdate() {
        updatedAt = System.currentTimeMillis();
    }
}
