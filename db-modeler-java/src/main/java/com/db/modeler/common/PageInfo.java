package com.db.modeler.common;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class PageInfo {
    private int current;      // 当前页码
    private int pageSize;     // 每页条数
    private long total;       // 总记录数
    private int totalPages;   // 总页数

    public PageInfo(int current, int pageSize, long total) {
        this.current = current;
        this.pageSize = pageSize;
        this.total = total;
        this.totalPages = (int) Math.ceil((double) total / pageSize);
    }
}
