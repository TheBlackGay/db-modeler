import mysql from 'mysql2/promise';

async function createDatabase() {
  try {
    // 创建连接到 MySQL 服务器（不指定数据库）
    const connection = await mysql.createConnection({
      host: '10.10.5.113',
      user: 'admin',
      password: 'x5Pvyjzc7v4bDzB0'
    });

    // 创建数据库
    await connection.query('CREATE DATABASE IF NOT EXISTS pdmaner');
    
    console.log('数据库 pdmaner 创建成功');

    // 关闭连接
    await connection.end();
  } catch (error) {
    console.error('创建数据库时出错:', error);
  }
}

createDatabase();
