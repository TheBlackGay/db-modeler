package com.db.modeler.service;

import com.db.modeler.entity.TableDesign;

public interface DDLGeneratorService {
    /**
     * 生成创建表的DDL语句
     * @param tableDesign 表设计
     * @return 创建表的DDL语句
     */
    String generateCreateTableDDL(TableDesign tableDesign);

    /**
     * 生成修改表的DDL语句
     * @param oldTableDesign 原表设计
     * @param newTableDesign 新表设计
     * @return 修改表的DDL语句列表
     */
    String generateAlterTableDDL(TableDesign oldTableDesign, TableDesign newTableDesign);

    /**
     * 执行DDL语句
     * @param ddl DDL语句
     */
    void executeDDL(String ddl);
}
