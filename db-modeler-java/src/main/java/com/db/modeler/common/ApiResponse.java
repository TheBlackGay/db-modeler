package com.db.modeler.common;

import lombok.Data;
import java.util.List;

@Data
public class ApiResponse<T> {
    private int code;
    private String message;
    private T data;

    private ApiResponse(int code, String message, T data) {
        this.code = code;
        this.message = message;
        this.data = data;
    }

    // 成功响应 - 无数据
    public static ApiResponse<Void> success() {
        return new ApiResponse<>(0, "success", null);
    }

    // 成功响应 - 详情
    public static <T> ApiResponse<T> success(T data) {
        return new ApiResponse<>(0, "success", data);
    }

    // 成功响应 - 列表
    public static <T> ApiResponse<List<T>> successList(List<T> data) {
        return new ApiResponse<>(0, "success", data);
    }

    // 成功响应 - 分页
    public static <T> ApiResponse<PageResult<T>> successPage(List<T> records, PageInfo pageInfo) {
        PageResult<T> pageResult = new PageResult<>(records, pageInfo);
        return new ApiResponse<>(0, "success", pageResult);
    }

    // 错误响应
    public static <T> ApiResponse<T> error(String message) {
        return new ApiResponse<>(-1, message, null);
    }

    public static <T> ApiResponse<T> error(int code, String message) {
        return new ApiResponse<>(code, message, null);
    }
}
