'use strict';

const renameColumnIfExists = async (queryInterface, tableName, oldColumnName, newColumnName) => {
  try {
    const tableInfo = await queryInterface.describeTable(tableName);
    if (tableInfo[oldColumnName]) {
      await queryInterface.renameColumn(tableName, oldColumnName, newColumnName);
      console.log(`Successfully renamed ${tableName}.${oldColumnName} to ${newColumnName}`);
    } else {
      console.log(`Column ${oldColumnName} does not exist in table ${tableName}`);
    }
  } catch (error) {
    if (error.name === 'SequelizeDatabaseError') {
      console.log(`Table ${tableName} does not exist`);
    } else {
      throw error;
    }
  }
};

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 更新 Users 表字段
    await renameColumnIfExists(queryInterface, 'Users', 'created_at', 'createdAt');
    await renameColumnIfExists(queryInterface, 'Users', 'updated_at', 'updatedAt');
    await renameColumnIfExists(queryInterface, 'Users', 'last_login_at', 'lastLoginAt');

    // 更新 Roles 表字段
    await renameColumnIfExists(queryInterface, 'Roles', 'created_at', 'createdAt');
    await renameColumnIfExists(queryInterface, 'Roles', 'updated_at', 'updatedAt');

    // 更新 UserRoles 表字段
    await renameColumnIfExists(queryInterface, 'UserRoles', 'user_id', 'userId');
    await renameColumnIfExists(queryInterface, 'UserRoles', 'role_id', 'roleId');

    // 更新 AuditLogs 表字段
    await renameColumnIfExists(queryInterface, 'AuditLogs', 'created_at', 'createdAt');
    await renameColumnIfExists(queryInterface, 'AuditLogs', 'updated_at', 'updatedAt');
    await renameColumnIfExists(queryInterface, 'AuditLogs', 'user_id', 'userId');
    await renameColumnIfExists(queryInterface, 'AuditLogs', 'ip_address', 'ipAddress');
  },

  down: async (queryInterface, Sequelize) => {
    // 还原 Users 表字段
    await renameColumnIfExists(queryInterface, 'Users', 'createdAt', 'created_at');
    await renameColumnIfExists(queryInterface, 'Users', 'updatedAt', 'updated_at');
    await renameColumnIfExists(queryInterface, 'Users', 'lastLoginAt', 'last_login_at');

    // 还原 Roles 表字段
    await renameColumnIfExists(queryInterface, 'Roles', 'createdAt', 'created_at');
    await renameColumnIfExists(queryInterface, 'Roles', 'updatedAt', 'updated_at');

    // 还原 UserRoles 表字段
    await renameColumnIfExists(queryInterface, 'UserRoles', 'userId', 'user_id');
    await renameColumnIfExists(queryInterface, 'UserRoles', 'roleId', 'role_id');

    // 还原 AuditLogs 表字段
    await renameColumnIfExists(queryInterface, 'AuditLogs', 'createdAt', 'created_at');
    await renameColumnIfExists(queryInterface, 'AuditLogs', 'updatedAt', 'updated_at');
    await renameColumnIfExists(queryInterface, 'AuditLogs', 'userId', 'user_id');
    await renameColumnIfExists(queryInterface, 'AuditLogs', 'ipAddress', 'ip_address');
  }
};
